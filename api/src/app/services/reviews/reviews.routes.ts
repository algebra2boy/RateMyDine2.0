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

// // delete an existing food review for a particular dining hall
// reviewRouter.delete("/review/:dininghall/:reviewID", async (req, res) => {

//     let diningHallName = req.params.dininghall;
//     let foodReviewID   = req.params.reviewID;

//     let result = await dbUtils.deleteReview(diningHallName, foodReviewID);
//     res.send(result);
// });

export default reviewRouter;
