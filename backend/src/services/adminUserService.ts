import { User } from "../entities/user";
import { AdminUserRepo } from "../repositories/adminUserRepo";



export class AdminUserService {
    private adminUserRepository: AdminUserRepo;
    constructor(adminUserRepository: AdminUserRepo) {
        this.adminUserRepository = adminUserRepository;
    }
    addUser(data:User){ 
        this.adminUserRepository.addUser(data);
    }
}
