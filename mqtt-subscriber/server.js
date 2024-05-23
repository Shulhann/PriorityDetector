const mqtt = require('mqtt');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the CORS middleware

const MQTT_BROKER_URL = 'mqtt://35.224.118.98:1883'; // MQTT Broker URL
const MQTT_TOPIC = 'sensor/temperature'; // MQTT Topic

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Use the CORS middleware

let lastTemperature = null;

// Connect to the MQTT broker
const client = mqtt.connect(MQTT_BROKER_URL);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(MQTT_TOPIC, (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
    }
  });
});

client.on('message', (topic, message) => {
  if (topic === MQTT_TOPIC) {
    const temp = parseFloat(message.toString());
    console.log(`Received temperature data: ${temp}`);
    lastTemperature = temp; // Update the latest temperature value
  }
});

// API endpoint to get the latest temperature data
app.get('/api/temperature', (req, res) => {
  if (lastTemperature === null) {
    res.status(404).json({ error: 'No temperature data available' });
  } else {
    res.json({ temperature: lastTemperature });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
