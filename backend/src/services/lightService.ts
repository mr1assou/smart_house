// src/services/LightService.ts
import { MqttClient } from "../utils/mqttClient";

export class LightService {
    constructor() {
        MqttClient.initialize();
    }
    public async turnOnLights(): Promise<void> {
        await MqttClient.publish("lights/on", "Turning on the lights");
    }
    public async adjustBrightness(): Promise<void> {
        await MqttClient.publish("adjustBrightness/on", "adjust Brightness");
    }
}
