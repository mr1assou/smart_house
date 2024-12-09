import express from "express";
import { UserController } from "../controllers/userController";
import { UserRepo } from "../repositories/userRepo";
const userRouter=express.Router();
const repo=new UserRepo();
const controller=new UserController(repo);
// endpointes of apis
userRouter.post("/addUser",controller.addUser.bind(controller));

export default userRouter;
