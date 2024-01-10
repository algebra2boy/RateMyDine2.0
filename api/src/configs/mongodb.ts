import { MongoClient, ServerApiVersion, Db } from 'mongodb';

export class MongoDB {
	private static instance: MongoDB;
	private static client: MongoClient;
	private static rateMyDineDB: Db;

	/**
	 * The MongoDB's constructor should be hidden to prevent direct
	 * construction from the client's perspective
	 */
	private constructor() {}

	/**
	 * The static method keeps the access of the client singleton.
	 */
	public static getInstance(): MongoDB {
		if (!MongoDB.instance) {
			MongoDB.instance = new MongoDB();
			MongoDB.setClient();
		}

		return MongoDB.instance;
	}

	private static setClient() {
		if (!process.env.MONGODB_URL) throw new Error('MongoDB URL not found');
		MongoDB.client = new MongoClient(process.env.MONGODB_URL, {
			serverApi: {
				version: ServerApiVersion.v1,
				strict: true,
				deprecationErrors: true,
			},
		});
	}

	public static getRateMyDineDB(): Db {
		if (!MongoDB.rateMyDineDB) throw new Error('Mongo DB does not exist yet...');
		return MongoDB.rateMyDineDB;
	}

	public async run() {
		try {
			// Connect the client to the server
			const client = await MongoDB.client.connect();

			// Send a ping to confirm a successful connection
			await client.db('RateMyDine').command({ ping: 1 });

			console.log('Pinged your deployment. You successfully connected to MongoDB!');

			// set singleston database
			MongoDB.rateMyDineDB = MongoDB.client.db('RateMyDine');
		} catch (error) {
			console.error(error);
		}
	}
}
