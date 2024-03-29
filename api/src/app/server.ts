import express, { Request, Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import status from 'http-status';
import 'dotenv/config';

import { MongoDB } from './configs/mongodb.js';
import routes from './routes/routes.js';
import errorMiddleware from './middlewares/Error.mw.js';
import morganMiddleware from './middlewares/Morgan.mw.js';

const app = express();

/**
 * Dependencies configurations
 */

app.use(morgan('dev'));
app.use(morganMiddleware);
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.static('src/public')); // serve static files
app.use(express.json());
app.use(routes);
app.use(errorMiddleware); // this must be placed at the end

app.get('/', (req: Request, res: Response) => {
    res.status(status.OK).json({ message: 'hello' });
});

// Establish mongodb connection
await MongoDB.getInstance().runServer();

/**
 * Server Listening for connections
 */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`the server is running on port ${PORT}`);
});
