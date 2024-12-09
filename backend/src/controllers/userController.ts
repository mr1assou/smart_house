import { NextFunction, Request, Response } from "express";
import { UserRepo } from "../repositories/userRepo";

export class UserController {
    private userRepo: UserRepo;
    constructor(userRepo: UserRepo) {
        this.userRepo = userRepo;
    }
    async addUser(req: Request, res: Response, next: NextFunction) : Promise<any>{
        try {
            console.log(req.body);
            const value =await this.userRepo.addUser(req.body);
            return res.json({ message: value});
        }
        catch(err){
            next(err);
        }
    }
}