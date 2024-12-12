import express from "express";
import { AdminUserController } from "../controllers/userController";
import { AdminUserRepo } from "../repositories/adminUserRepo";
import { AdminUserService } from "../services/adminUserService";

const adminUserRouter=express.Router();
const controller=new AdminUserController(new AdminUserService(new AdminUserRepo()));
// endpointes of apis
adminUserRouter.post("/addUser",controller.addUser.bind(controller));

export default adminUserRouter;
