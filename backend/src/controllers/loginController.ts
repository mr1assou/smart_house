

import { NextFunction, Request, Response } from "express";
import { ILoginService } from "../interfaces/ILoginService";


export class LoginController {
    private loginService: ILoginService;
    constructor(loginService: ILoginService) {
        this.loginService= loginService;
    }
    async login(req: Request, res: Response, next: NextFunction) : Promise<any>{
        try {
            const value =await this.loginService.login();
            return res.json({ message: value});
        }
        catch(err){
            next(err);
        }
    }
}