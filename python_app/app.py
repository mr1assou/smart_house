from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col, lit
from pyspark.sql.types import StructType, StructField, FloatType, StringType, IntegerType
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassificationModel
import requests
import json

# Schema for incoming sensor data
SENSOR_SCHEMA = StructType([
    StructField("temperature", FloatType()),
    StructField("humidity", FloatType()),
    StructField("pm2_5", FloatType()),
    StructField("pm10", FloatType()),
    StructField("no2", FloatType()),
    StructField("so2", FloatType()),
    StructField("co", FloatType()),
    StructField("industrial_proximity", FloatType()),
    StructField("population_density", IntegerType()),
    StructField("timestamp", StringType())
])

def check_ventilation_status():
    try:
        response = requests.get('http://express_js:3000/ventilation/status')
        return response.json()['status']
    except Exception as e:
        print(f"Error checking ventilation status: {str(e)}")
        return None

def control_ventilation(action):
    try:
        endpoint = f'http://express_js:3000/ventilation/{action}'
        response = requests.post(endpoint)
        print(f"Ventilation {action.upper()}: {response.json()['message']}")
    except Exception as e:
        print(f"Error controlling ventilation: {str(e)}")

if __name__ == "__main__":
    spark = SparkSession.builder \
        .appName("AirQualityMonitor") \
        .getOrCreate()

    # Load pretrained Random Forest model
    model_path = "/opt/bitnami/spark/model/pretrained_model"
    rf_model = RandomForestClassificationModel.load(model_path)

    # Read streaming data from Kafka
    df = spark.readStream \
        .format("kafka") \
        .option("kafka.bootstrap.servers", "kafka:9092") \
        .option("subscribe", "sensor-data") \
        .option("startingOffsets", "latest") \
        .load()

    # Parse JSON from Kafka value column
    parsed_df = df.select(
        from_json(col("value").cast("string"), SENSOR_SCHEMA).alias("data")
    ).select("data.*")

    # Assemble features into vector to feed model
    feature_cols = [
        "temperature",
        "humidity",
        "pm2_5",
        "pm10",
        "no2",
        "so2",
        "co",
        "industrial_proximity",
        "population_density"
    ]

    assembler = VectorAssembler(inputCols=feature_cols, outputCol="features")
    feature_df = assembler.transform(parsed_df)

    # Apply the pretrained model to predict on streaming data
    predictions = rf_model.transform(feature_df)

    # Select relevant columns and prediction
    output_df = predictions.select(
        *feature_cols,
        col("timestamp"),
        col("prediction")
    )

    # Process each batch of predictions
    def process_batch(batch_df, batch_id):
        # Show the table first
        print("\n" + "="*60)
        print(f"Batch: {batch_id}")
        print("="*60)
        batch_df.show(truncate=False)
        
        # Convert to pandas for easier processing
        pdf = batch_df.toPandas()
        
        for _, row in pdf.iterrows():
            prediction = row['prediction']
            ventilation_status = check_ventilation_status()
            
            if ventilation_status is not None:
                # Good/Moderate air quality (0 or 1) and ventilation is ON
                if prediction in [0, 1] and ventilation_status:
                    control_ventilation('off')
                # Poor/Bad air quality (2 or 3) and ventilation is OFF
                elif prediction in [2, 3] and not ventilation_status:
                    control_ventilation('on')

    # Write prediction results to console and process for ventilation control
    query = output_df.writeStream \
        .outputMode("append") \
        .foreachBatch(process_batch) \
        .start()

    query.awaitTermination()
