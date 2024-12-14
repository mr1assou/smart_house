// src/services/LightService.ts
import { MqttClient } from "../utils/mqttClient";

export class LightService {
    constructor() {
        MqttClient.initialize();
    }
    public async turnOnLights(id:string): Promise<void> {
        await MqttClient.publish("lights/on", {lightId:id});
    }
    public async turnOffLights(id:string): Promise<void> {
        await MqttClient.publish("lights/off", {lightId:id});
    }
}
