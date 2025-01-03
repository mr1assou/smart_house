import { createPool, Pool } from "mysql2";

// connection to database using singelton design pattern
export class ConnectDatabase {
    public static client: Pool;
    static createConnection(): Pool {
      if (!ConnectDatabase.client) {
        try {
          ConnectDatabase.client = createPool({
            host: 'backend-mysql-1',
            port: parseInt('3306'),
            user: 'root',
            password: 'root',
            database:'smart_house',
          });
        } catch (err) {
          console.error('Error creating connection pool:', err);
          throw err; 
        }
      }
      return ConnectDatabase.client;
    }
}



