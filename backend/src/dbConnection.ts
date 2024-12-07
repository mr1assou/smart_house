import { createPool, Pool } from "mysql2";

// connection to database using singelton design pattern
export class ConnectDatabase {
    public static client: Pool;
    static createConnection(): Pool {
      if (!this.client) {
        try {
          this.client = createPool({
            host: '127.0.0.1',
            port: parseInt('3306'),
            user: 'root',
            password: 'root',
            database:'players',
          });
          console.log("goooooood");
        } catch (err) {
          console.error('Error creating connection pool:', err);
          throw err; 
        }
      }
      return this.client;
    }
}



