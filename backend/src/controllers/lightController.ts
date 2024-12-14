import { LightService } from "../services/lightService";
import { NextFunction, Request, Response } from "express";

export class LightController{
    lightService: LightService;
    constructor(lightService:LightService){
        this.lightService=lightService;
    }
    async turnOnLights(req:Request,res:Response,next:NextFunction): Promise<void>{
        const {id}=req.params;
        await this.lightService.turnOnLights(id.toString());
    }
    turnOffLights(req:Request,res:Response,next:NextFunction): void{
        const {id}=req.params;
        this.lightService.turnOffLights(id);
    }
}