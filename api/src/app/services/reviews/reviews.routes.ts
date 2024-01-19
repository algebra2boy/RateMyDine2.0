import express from 'express';

import * as reviewController from './reviews.controller.js';
import ZodMW from '../../middlewares/ZodValidation.mw.js';
import { reviewSchema } from '../../validations/reviews.validation.js';

const reviewRouter = express.Router();

reviewRouter.get('/diningInfo', reviewController.getAllDiningInfo);
reviewRouter.get('/info/:diningHall', reviewController.getDiningInfo);
reviewRouter.get('/:dininghall', reviewController.getReviewByDiningHall);
reviewRouter.post('/:diningHall', ZodMW(reviewSchema), reviewController.createReviewForDiningHall);
reviewRouter.put(
    '/:dininghall/:reviewID',
    ZodMW(reviewSchema),
    reviewController.updateReviewForDiningHall,
);
reviewRouter.delete('/:dininghall/:reviewID', reviewController.deleteReviewForDiningHall);

export default reviewRouter;
