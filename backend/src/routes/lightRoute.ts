import express from "express";
import { LightController } from "../controllers/lightController";
import { LightService } from "../services/lightService";
const lightRouter=express.Router();
const controller=new LightController(new LightService());
// endpointes of apis
lightRouter.post("/turnOnLights/:id",controller.turnOnLights.bind(controller));
lightRouter.post("/turnOffLights/:id",controller.turnOffLights.bind(controller));

export default lightRouter;
