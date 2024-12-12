import express from "express";
import { LoginController } from "../controllers/loginController";
import { LoginJwtService } from "../services/loginJwtService";
const loginRouter=express.Router();
const controller=new LoginController(new LoginJwtService());
// endpointes of apis
loginRouter.post("/login",controller.login.bind(controller));

export default loginRouter;
