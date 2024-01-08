import express from 'express';

const app = express();

app.get('/', (req, res) => {
	res.status(201).json({ message: 'hello' });
});

app.listen(8080, () => {
	console.log('the server is running on localhost:8080');
});
