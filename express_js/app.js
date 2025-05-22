const express = require('express');
const { Kafka } = require('kafkajs');
const app = express();
const port = 3000;

// Add state variable for ventilation
let ventilationStatus = false; // false means off, true means on

app.get('/', (req, res) => {
  res.send('Hello guys ');
});

// Add ventilation control endpoints
app.post('/ventilation/on', (req, res) => {
  ventilationStatus = true;
  console.log('Ventilation turned ON');
  res.json({ status: 'success', message: 'Ventilation turned ON', currentStatus: ventilationStatus });
});

app.post('/ventilation/off', (req, res) => {
  ventilationStatus = false;
  console.log('Ventilation turned OFF');
  res.json({ status: 'success', message: 'Ventilation turned OFF', currentStatus: ventilationStatus });
});

app.get('/ventilation/status', (req, res) => {
  res.json({ status: ventilationStatus });
});

app.listen(port, () => {
  console.log(`Hello guys http://localhost:${port}`);
});

const kafka = new Kafka({
  clientId: 'sensor-producer',
  brokers: ['kafka:9092'] // Docker Compose service name
});

const producer = kafka.producer();

// Connect to Kafka once when the application starts
const initializeKafka = async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka successfully');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error.message);
    // Retry connection after 5 seconds
    setTimeout(initializeKafka, 5000);
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
  } catch (err) {
    console.error('❌ Error sending data:', err.message);
    // If there's an error, try to reconnect
    if (err.message.includes('not connected')) {
      await initializeKafka();
    }
  }
};

// Initialize Kafka connection when the application starts
initializeKafka();

// Send data every 10 seconds
setInterval(sendSensorData, 1000);