
// src/utils/mqttClient.ts
import mqtt from 'mqtt';

export class MqttClient {
    private client: any;

    constructor(brokerUrl: string) {
        this.client = mqtt.connect(brokerUrl);
    }
    
    async publish(topic: string, message: string): Promise<void> {
        this.client.publish(topic, message, (err: any) => {
            if (err) {
                console.error("Failed to publish message", err);
            }
        });
    }

    subscribe(topic: string, callback: (message: string) => void): void {
        this.client.subscribe(topic, (err: any) => {
            if (err) {
                console.error("Failed to subscribe to topic", err);
            }
        });

        this.client.on('message', (receivedTopic: string, payload: Buffer) => {
            if (receivedTopic === topic) {
                callback(payload.toString());
            }
        });
    }
}
