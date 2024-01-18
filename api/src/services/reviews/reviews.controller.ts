import { Request, Response } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import { DiningInfo, Review } from './reviews.model.js';
import { Collection } from 'mongodb';
import * as reviewService from './reviews.service.js';

/**
 * Retrieve dining hall info such as name and count of reviews.
 */
const getAllDiningInfo = async (req: Request, res: Response) => {
    const collection: Collection<DiningInfo> = MongoDB.getRateMyDineDB().collection('diningInfo');
    const diningInfo: DiningInfo[] = await collection.find({}).toArray();

    res.status(200).json(diningInfo);
};

/**
 * retrieve one dining info
 */
const getDiningInfo = async (req: Request, res: Response) => {
    // grabs the dining hall name from the query parameter
    const diningName: string = req.params.diningHall;

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
};

/**
 * get all the food review from a particular dining hall
 */
const getReviewByDiningHall = async (req: Request, res: Response) => {
    const diningHallName: string = req.params.dininghall;
    const document: Review[] | undefined = await reviewService.getReview(diningHallName);

    res.status(200).json(document);
};

const createReviewForDiningHall = async (req: Request, res: Response) => {
    const diningHallReview = req.body;
    const diningHallName: string = req.params.diningHall;

    const result = (await reviewService.createReview(
        diningHallName,
        diningHallReview,
        'jcli47',
    )) as string;
    res.send(result);
};

export { getAllDiningInfo, getDiningInfo, getReviewByDiningHall, createReviewForDiningHall };
