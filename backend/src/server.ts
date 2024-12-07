
import express, {Express, Request, Response} from 'express';
import { ConnectDatabase } from './dbConnection';
import { QueryResult } from 'mysql2';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response)=>{
    res.send('this is Marwane Assou');
});

app.listen(port, ()=> {
console.log(`[Server]: I am running at https://localhost:${port} `);
});

const db =ConnectDatabase.createConnection();
db.query(`CALL showUsers(?)`,[1], (err, results : any) => {
    if (err) {
        console.error('Error executing stored procedure:', err);
    } else {
        console.log(results[0][0]);
    }
});





