const express = require('express');
const { Kafka } = require('kafkajs');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello guys ');
});

app.listen(port, () => {
  console.log(`Hello guys http://localhost:${port}`);
});


const kafka = new Kafka({
  clientId: 'sensor-producer',
  brokers: ['kafka:9092'] // Docker Compose service name
});

const producer = kafka.producer();

const connectToKafka = async () => {
  try {
    await producer.connect();
    console.log('Connected succefully');
  } catch (error) {
    console.error('Failed to co', error.message);
  }
};

const sendSensorData = async () => {
  // Generate more realistic sensor data with additional fields
  const sensorData = {
    temperature: parseFloat((Math.random() * 40).toFixed(1)),  // number, not string
    humidity: parseFloat((Math.random() * 100).toFixed(1)),
    pm2_5: parseFloat((Math.random() * 300).toFixed(1)),
    pm10: parseFloat((Math.random() * 500).toFixed(1)),
    no2: parseFloat((Math.random() * 200).toFixed(1)),
    so2: parseFloat((Math.random() * 150).toFixed(1)),
    co: parseFloat((Math.random() * 10).toFixed(2)),
    industrial_proximity: 30,
    population_density: 80000,
    timestamp: new Date().toISOString()
  };

  try {
    await producer.send({
      topic: 'sensor-data',
      messages: [{ value: JSON.stringify(sensorData) }]
    });
    console.log('📤 Data sent to kafka:', sensorData);
  } catch (err) {
    console.error('❌ Error sending data:', err.message);
  }
};

const run = async () => {
  await connectToKafka();
  await sendSensorData();
};

// run();

setInterval(run, 1000);