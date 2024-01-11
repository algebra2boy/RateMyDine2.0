import { MongoClient, ServerApiVersion, Db } from 'mongodb';

/**
 * The **MongoDB** class is a custom class that allows for making Connections to MongoDB.
 * @example
 * ```ts
 * import { MongoDB } from './configs/mongodb.js';
 * import { Db, Collection } from 'mongodb';
 *
 * // Start running the server, only used once
 * MongoDB.getInstance().runServer()
 *
 * // How to retrieve the rateMyDine Database
 * const database: Db = MongoDB.getRateMyDineDB()
 *
 * // How to retrieve the collection with a genetric type <T>
 * const <collection-name>: Collection<T> = MongoDB.getRateMyDineDB().collection(<collection-name>);
 * ```
 */
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

    /**
   The static method sets the connection to MongoDB using the environment database url.
   Connection pooling is used for multi-threading enviornment, allowing multiple 
   threads to use separate connections concurrently
   */
    private static setClient() {
        if (!process.env.MONGODB_URL) throw new Error('MongoDB URL not found');
        MongoDB.client = new MongoClient(process.env.MONGODB_URL, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
            minPoolSize: 10, // minimum number of connections in the pool
            maxPoolSize: 100, // maximum number of connections in the pool
        });
    }

    /**
     * This static method retrieves the rateMyDineDB Db
     * @returns rateMyDineDB MongoDB Database.
     */
    public static getRateMyDineDB(): Db {
        if (!MongoDB.rateMyDineDB)
            throw new Error('Mongo ratemyDine Database does not exist yet...');
        return MongoDB.rateMyDineDB;
    }

    /**
     * This method connects the client to the server,
     * sends a ping to confirm a succesful connection, and
     * sets a singleston database
     */
    public async runServer() {
        try {
            const client = await MongoDB.client.connect();

            await client.db('RateMyDine').command({ ping: 1 });

            console.log('Pinged your deployment. You successfully connected to MongoDB!');

            MongoDB.rateMyDineDB = MongoDB.client.db('RateMyDine');
        } catch (error) {
            console.error(error);
        }
    }
}
