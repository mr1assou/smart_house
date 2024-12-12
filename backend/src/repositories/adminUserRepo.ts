import { ConnectDatabase } from "../utils/dbConnection";
import {Pool} from "mysql2";
import { User } from "../entities/user";

export class AdminUserRepo {
    private connectionDb: Pool;
    constructor() {
        this.connectionDb = ConnectDatabase.createConnection();
    }
    async addUser(data: User) : Promise<any> {
        const {email,password} =data;
        try {
            // Use await with the query
            const result=await this.connectionDb.promise().query(`CALL addUser(?, ?)`, [email, password]);
            return true; // Return true if no error
        } catch (err) {
            console.error('Error executing stored procedure:', err);
            return false; // Return false in case of an error
        }
    }
}