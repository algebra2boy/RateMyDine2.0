import { NextFunction, Request, Response } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import { DiningInfo, Feedback, Review } from './reviews.model.js';
import { Collection } from 'mongodb';
import * as reviewService from './reviews.service.js';
import { HttpError } from '../../utils/httpError.utils.js';

/**
 * Retrieve dining hall info such as name and count of reviews.
 */
const getAllDiningInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const collection: Collection<DiningInfo> =
            MongoDB.getRateMyDineDB().collection('diningInfo');
        const diningInfo: DiningInfo[] = await collection.find<DiningInfo>({}).toArray();

        res.status(200).json(diningInfo);
    } catch (error) {
        next(error);
    }
};

/**
 * retrieve one dining info
 */
const getDiningInfo = async (req: Request, res: Response, next: NextFunction) => {
    const diningName: string = req.params.diningHall;

    try {
        const collection: Collection<DiningInfo> =
            MongoDB.getRateMyDineDB().collection('diningInfo');
        const diningInfo: DiningInfo | null = await collection.findOne({ name: diningName });

        // Dining Hall information doesn't exist
        if (!diningInfo) {
            throw new HttpError(404, {
                message: `${diningName} is not found in the database`,
            });
        }
        res.status(200).json(diningInfo);
    } catch (error) {
        next(error);
    }
};

/**
 * get all the food review from a particular dining hall
 */
const getReviewByDiningHall = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const diningHallName: string = req.params.dininghall;
        const document: Review[] | undefined = await reviewService.getReview(diningHallName);

        res.status(200).json(document);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new food review for a dining hall
 */
const createReviewForDiningHall = async (req: Request, res: Response, next: NextFunction) => {
    const feedback: Feedback = req.body;
    const diningHallName: string = req.params.diningHall;

    try {
        const result = await reviewService.createReview(diningHallName, feedback, 'jcli47');
        res.status(201).json(result);
    } catch (error) {
        next(error);
    }
};

/**
 * update an existing food review for a particular dining hall
 */
const updateReviewForDiningHall = async (req: Request, res: Response, next: NextFunction) => {
    const feedback: Feedback = req.body;
    const diningHallName: string = req.params.dininghall;
    const foodReviewID: string = req.params.reviewID;

    try {
        const result = await reviewService.updateReview(diningHallName, feedback, foodReviewID);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export {
    getAllDiningInfo,
    getDiningInfo,
    getReviewByDiningHall,
    createReviewForDiningHall,
    updateReviewForDiningHall,
};
