import { NextFunction, Request, Response } from "express";
import { AdminUserService} from "../services/adminUserService";


export class AdminUserController {
    private adminUserService: AdminUserService;
    constructor(adminUserService: AdminUserService) {
        this.adminUserService = adminUserService;
    }
    async addUser(req: Request, res: Response, next: NextFunction) : Promise<any>{
        try {
            const value =await this.adminUserService.addUser(req.body);
            return res.json({ message: value});
        }
        catch(err){
            next(err);
        }
    }
}