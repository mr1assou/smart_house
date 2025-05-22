from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import StructType, StructField, FloatType, StringType, IntegerType
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.classification import RandomForestClassificationModel

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

    # Write prediction results to console
    query = output_df.writeStream \
        .outputMode("append") \
        .format("console") \
        .option("truncate", "false") \
        .start()

    query.awaitTermination()
