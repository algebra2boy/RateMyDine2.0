import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { DiningInfo, Feedback, Review } from './reviews.model.js';
import * as reviewService from './reviews.service.js';

/**
 * Retrieve every dining hall info such as name and count of reviews.
 */
const getAllDiningInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const allDiningInfo: DiningInfo[] = await reviewService.findAllDiningInfo();
        res.status(status.OK).json(allDiningInfo);
    } catch (error) {
        next(error);
    }
};

/**
 * retrieve one dining hall info such as name and count of reviews.
 */
const getDiningInfo = async (req: Request, res: Response, next: NextFunction) => {
    const diningName: string = req.params.diningHall;

    try {
        const diningInfo: DiningInfo = await reviewService.findDiningInfo(diningName);
        res.status(status.OK).json(diningInfo);
    } catch (error) {
        next(error);
    }
};

/**
 * get all the food review from a particular dining hall
 */
const getReviewByDiningHall = async (req: Request, res: Response, next: NextFunction) => {
    const diningHallName: string = req.params.dininghall;

    try {
        const document: Review[] = await reviewService.getReview(diningHallName);
        res.status(status.OK).json(document);
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
        res.status(status.OK).json(result);
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
        res.status(status.OK).json(result);
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
