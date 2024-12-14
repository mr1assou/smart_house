// src/utils/mqttClient.ts
import mqtt from "mqtt";


export class MqttClient {
    public static client: any;
    private static isConnected = false;

    public static initialize(): void {
        if (!MqttClient.client) {
            MqttClient.client = mqtt.connect("mqtt://192.168.8.105:1883");
            MqttClient.client.on("connect", () => {
                MqttClient.isConnected = true;
                console.log("Connected successfully to MQTT broker");
            });
            MqttClient.client.on("error", (err: any) => {
                console.error("MQTT connection error:", err.message);
            });
        }
    }

    public static async publish(topic: string, message: any): Promise<void> {
        console.log(message)
        if (!MqttClient.isConnected) {
            console.error("MQTT client not connected. Unable to publish.");
            return;
        }
        MqttClient.client.publish(topic,JSON.stringify(message), (err: any) => {
            if (err) {
                console.error("Failed to publish message", err);
            } else {
                console.log(`Message published to topic '${topic}': ${JSON.stringify(message)}`);
            }
        });
    }

    public static subscribe(topic: string, callback: (message: string) => void): void {
        if (!MqttClient.isConnected) {
            console.error("MQTT client not connected. Unable to subscribe.");
            return;
        }
        MqttClient.client.subscribe(topic, (err: any) => {
            if (err) {
                console.error("Failed to subscribe to topic", err);
            } else {
                console.log(`Subscribed to topic '${topic}'`);
                MqttClient.client.on("message", (receivedTopic: string, message: Buffer) => {
                    if (receivedTopic === topic) {
                        callback(message.toString());
                    }
                });
            }
        });
    }
}
