
import express, {Express, Request, Response} from 'express';
import userRouter from './routes/userRoute';

const app: Express = express();
app.use(express.json()); 

const port = 3000;

app.get('/', (req: Request, res: Response)=>{
    res.send('this is Marwane Assou');
});

app.listen(port);
app.use(userRouter);






