
import express, {Express, Request, Response} from 'express';
import loginRouter from './routes/loginRoute';
import adminUserRouter from './routes/adminUserRoute';
import lightRouter from './routes/lightRoute';
const app: Express = express();
app.use(express.json()); 

const port = 3000;

app.get('/', (req: Request, res: Response)=>{
    res.send('this is Marwane Assou');
});

app.listen(port);
app.use(loginRouter);
app.use(adminUserRouter);
app.use(lightRouter);






