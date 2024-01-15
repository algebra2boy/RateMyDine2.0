import { Request, Response } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import { DiningInfo} from './reviews.model.js';
import { Collection } from 'mongodb';
import * as reviewService from "./reviews.service.js"; 

/**
 * Retrieve dining hall info such as name and count of reviews.
 */
const getAllDiningInfo = async (req: Request, res: Response) => {
    const collection: Collection<DiningInfo> = MongoDB.getRateMyDineDB().collection('diningInfo');
    const diningInfo: DiningInfo[] = await collection.find({}).toArray();

    res.send(diningInfo);
};

/**
 * retrieve one dining info
 */
const getDiningInfo = async (req: Request, res: Response) => {
    // grabs the dining hall name from the URL
    const diningName = req.params.diningHall;

    const collection: Collection<DiningInfo> = MongoDB.getRateMyDineDB().collection('diningInfo');
    const diningInfo: DiningInfo | null = await collection.findOne({ name: diningName });

    // Dining Hall information doesn't exist
    if (!diningInfo) {
        return res.status(404).json({
            message: `${diningName} is not found in the database`,
            status: 'failure',
        });
    }
    res.status(200).json(diningInfo);
}

/**
 * get all the food review from a particular dining hall
 */
const getReviewByDiningHall = async (req: Request, res: Response) => {

    const diningHallName = req.params.dininghall;

    const document = await reviewService.getReview(diningHallName);
    res.send(document);
}

const createReviewForDiningHall = async (req: Request, res: Response) => {

//     console.log(req.isAuthenticated());
//     if (!req.isAuthenticated()) { // user is not authenticated
//         res.status(401).json( { message: "user is not authorized to make a review", status : "failure" } );
//         return;
//     }

//     // user is authenticated from here
    const diningHallReview = req.body; // grabs the body from the post requests
    const diningHallName   = req.params.diningHall;


    const result = await reviewService.createReview(diningHallName, diningHallReview, "jcli47") as string;
    res.send(result);
}

export {
    getAllDiningInfo,
    getDiningInfo,
    getReviewByDiningHall,
    createReviewForDiningHall
}