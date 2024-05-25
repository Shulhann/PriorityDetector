#include <Wire.h>
#include <Adafruit_MLX90614.h>
#include <WiFi.h>
#include <PubSubClient.h>

// Replace these with your network credentials
const char* ssid = "qwerty";
const char* password = "12345678";

// MQTT broker IP and port
const char* mqtt_server = "35.224.118.98";
const int mqtt_port = 1883; // Default MQTT port

Adafruit_MLX90614 mlx = Adafruit_MLX90614();

// Create a WiFi and MQTT client instance
WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(9600);
  Serial.println("Adafruit MLX90614 test");

  // Initialize the sensor
  mlx.begin();

  // Connect to WiFi
  setup_wifi();

  // Set the MQTT server and port
  client.setServer(mqtt_server, mqtt_port);
  reconnect();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  float objectTemp = mlx.readObjectTempC();
  Serial.print("Ambient = "); Serial.print(mlx.readAmbientTempC());
  Serial.print("C\tObject = "); Serial.print(objectTemp); Serial.println("C");

  // Convert the temperature to a string and publish it to the MQTT broker
  char tempString[8];
  dtostrf(objectTemp, 6, 2, tempString);
  client.publish("sensor/temperature", tempString);

  delay(500);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  // Loop until we're reconnected
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect("ArduinoClient")) {
      Serial.println("connected");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}
