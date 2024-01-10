import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import * as dotenv from 'dotenv';

import { MongoDB } from './configs/mongodb.js';

import routes from './routes/routes.js';

dotenv.config();

const app = express();

app.get('/', (req: Request, res: Response) => {
	res.status(201).json({ message: 'hello' });
});

/*
	Dependencies configurations
*/

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', routes);

// Establish mongodb connection
MongoDB.getInstance().run();

app.listen(8080, () => {
	console.log('the server is running on port 8080');
});
