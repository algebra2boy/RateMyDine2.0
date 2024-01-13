import express from 'express';
import * as reviewController from "./reviews.controller.js";

const reviewRouter = express.Router();

reviewRouter.get('/diningInfo', reviewController.getAllDiningInfo);
reviewRouter.get('/info/:diningHall', reviewController.getDiningInfo);
reviewRouter.get('/review/:dininghall', reviewController.getReviewByDiningHall)

// // create a new food review for a particular dining hall
// reviewRouter.post("/review/:diningHall", ValidateFoodReviewSchema,  async (req, res) => {

//     // does not meet all the required food rating
//     const errors = validationResult(req);
//     console.log(errors);
//     if (!errors.isEmpty()) {
//         res.status(400).json( { errors: errors.array(), status: "failure" } );
//         return;
//     }

//     console.log(req.isAuthenticated());
//     if (!req.isAuthenticated()) { // user is not authenticated
//         res.status(401).json( { message: "user is not authorized to make a review", status : "failure" } );
//         return;
//     }

//     // user is authenticated from here
//     let diningHallReview = req.body; // grabs the body from the post requests
//     let diningHallName   = req.params.diningHall;

//     let result      = await dbUtils.createReview(diningHallName, diningHallReview, req.user);
//     let rev_Date    = new Date(result.review_date)
//     let revDate_arr = rev_Date.toDateString().split(" ");
//     let leObject    = new Review(result.review_id, (revDate_arr[1]+" "+ rev_Date.getDate() + ", " + revDate_arr[3]) ,result.reviewer_name, result.overall, result.description,
//                                 result.FoodQuality, result.CustomerService, result.Atmosphere, result.Healthiness, result.SeatAvailability, result.Taste, diningHallName);
//     res.send(JSON.stringify(leObject));
// });

// // update an existing food review for a particular dining hall
// reviewRouter.post("/review/:dininghall/:reviewID", async (req, res) => {
//     // grabs parameters and calls corresponding helper function
//     let foodReview     = req.body.review;
//     let diningHallName = req.params.dininghall;
//     let foodReviewID   = req.params.reviewID;

//     let result = await dbUtils.updateReview(diningHallName, foodReview, foodReviewID);
//     res.send(result);
// });

// // delete an existing food review for a particular dining hall
// reviewRouter.delete("/review/:dininghall/:reviewID", async (req, res) => {

//     let diningHallName = req.params.dininghall;
//     let foodReviewID   = req.params.reviewID;

//     let result = await dbUtils.deleteReview(diningHallName, foodReviewID);
//     res.send(result);
// });

// find all the review that belongs to the user
// reviewRouter.get('/review/user/:username', async (req, res) => {
//     let username = req.params.username;
//     let result = await dbUtils.findAllReviews(username);
//     res.send(result);
// });

export default reviewRouter;
