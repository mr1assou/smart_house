
import express, {Express, Request, Response} from 'express';
import { ConnectDatabase } from './dbConnection';

const app: Express = express();
const port = 3000;

app.get('/', (req: Request, res: Response)=>{
    res.send('this is Marwane Assou');
});

app.listen(port, ()=> {
console.log(`[Server]: I am running at https://localhost:${port} `);
});

const dt =ConnectDatabase.createConnection();




