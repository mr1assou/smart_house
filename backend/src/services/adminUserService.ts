import { User } from "../entities/user";
import { AdminUserRepo } from "../repositories/adminUserRepo";



export class AdminUserService {
    private adminUserRepository: AdminUserRepo;
    constructor(adminUserRepository: AdminUserRepo) {
        this.adminUserRepository = adminUserRepository;
    }
    addUser(data:User){ 
        console.log(data.email);
        console.log(data.password);
        console.log(data.role);
        this.adminUserRepository.addUser(data);
    }
}
