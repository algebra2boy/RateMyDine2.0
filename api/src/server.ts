import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import 'dotenv/config';


import { MongoDB } from './configs/mongodb.js';
import routes from './routes/routes.js';
import ErrorMiddleware from './middlewares/Error.mw.js';


const app = express();

/**
 * Dependencies configurations
 */

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (req: Request, res: Response) => {
    res.status(201).json({ message: 'hello' });
});

// Establish mongodb connection
await MongoDB.getInstance().runServer();

app.use(ErrorMiddleware);

/**
 * Server Listening for connections
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`);
});
