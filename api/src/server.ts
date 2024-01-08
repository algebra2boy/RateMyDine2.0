import express from 'express';
import { Request, Response } from "express";

const app = express();

app.get('/', (req: Request, res: Response) => {
	res.status(201).json({ message: 'hello' });
});

app.listen(8080, () => {
	console.log('the server is running on localhost:8080');
});
