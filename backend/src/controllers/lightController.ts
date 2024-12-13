import { LightService } from "../services/lightService";


export class LightController{
    lightService: LightService;
    constructor(lightService:LightService){
        this.lightService=lightService;
    }
    turnOnLights(): void{
        this.lightService.turnOnLights();
    }
    adjustBrightness(): void{
        this.lightService.adjustBrightness();
    }
}