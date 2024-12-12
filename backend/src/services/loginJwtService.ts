import { ILoginService } from "../interfaces/ILoginService";



export class LoginJwtService implements ILoginService{
    login(): void {
        console.log("login with jwt");
    }
    
}

