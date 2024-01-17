import { MongoDB } from '../../configs/mongodb.js';
import { Feedback, Review } from './reviews.model.js';
import { createReviewDate } from '../../utils/date.utils.js';
import { computeAverageScore } from '../../utils/computeScore.utils.js';
import { Db } from 'mongodb';

/**
 * Adds a new review to the dining hall document in the database using user's feedback
 * @param {string} diningHall - the name of the dining hall
 * @param {Feedback} feedback - the user food feedback
 * @param {string} username - the user name
 */
async function createReview(diningHall: string, feedback: Feedback, username: string) {
    try {
        // gets the review document matching the dining hall.
        const database: Db = MongoDB.getRateMyDineDB();
        const document = await database.collection('reviews').findOne({ DiningHall: diningHall });

        if (!document) return null;

        const newFoodReview = constructFoodReview(document, feedback, username);

        document.Reviews.unshift(newFoodReview); // adds the new review object to the front of the reviews array.

        // puts the updated dining hall doc in the review collection
        const filter = { DiningHall: diningHall };
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                Reviews: document !== null ? document.Reviews : [newFoodReview],
            },
        };
        await database.collection('reviews').updateOne(filter, updateDoc, options);
        // update the number of reviews in the diningInfo
        const infoDoc = await database.collection('diningInfo').findOne({ name: diningHall });
        await database.collection('diningInfo').updateOne(
            { name: diningHall },
            {
                $set: { numReviews: infoDoc !== null ? infoDoc.numReviews + 1 : 1 },
            },
        );
        const updatedInfoDoc = await database
            .collection('reviews')
            .findOne({ DiningHall: diningHall });
        return JSON.stringify(updatedInfoDoc);
    } catch (error) {
        console.error(error);
    }
}

function constructFoodReview(document: any, feedback: Feedback, username: string) {
    return {
        review_id: document.Reviews[0] !== undefined ? document.Reviews[0]['review_id'] + 1 : 1,
        review_date: new Date(Date.now()).toISOString(),
        reviewer_name: username,
        overall: computeAverageScore(feedback),
        ...feedback,
    };
}

/**
 * Gets all the reviews for a particular dining hall and returns it to the front-end.
 * @param  {string} diningHall - the name of the dinning hall.
 * @return {Review[]} review - reviews from all the diningHall.
 */
async function getReview(diningHall: string): Promise<Review[] | undefined> {
    try {
        // gets all the review document from the rateMyDine db for the dinning hall
        const database: Db = MongoDB.getRateMyDineDB();
        const result = await database.collection('reviews').findOne({ DiningHall: diningHall });

        if (!result || !result.Reviews) return [];

        // loop over every review for that dining hall
        const review: Review[] = [];
        for (const comment of result.Reviews) {
            comment.review_date = createReviewDate(comment.review_date); // convert the date
            comment.location = diningHall; // add location name to each comment
            review.push(comment);
        }
        return review;
    } catch (error) {
        console.error(error);
    }
}

// /**
//  * update an existing food review for a dining hall and returns it to the front-end.
//  * @param  {string} diningHall        - the name of the diningName, ex "Worcester"
//  * @param  {Review Object} foodReview - the review of the food
//  * @param  {string} foodReviewID      - the food review ID
//  * @return {boolean}                  = whether the foodReviewID exists in db
//  */

// async function updateReview(diningHall: string, foodReview: string, foodReviewID: string) {
//     try {
//         const database = MongoDB.getRateMyDineDB();
//         const document = await database.collection('reviews').findOne({ DiningHall: diningHall }); // gets the document of the dining hall.

//         // loops through the reviews of the dining hall and tries to find the matching post id.
//         for (let i = 0; i < (document !== null ? document['Reviews'].length : 0); i++) {
//             if (document !== null && document.Reviews[i].review_id === Number(foodReviewID)) {
//                 // if the id matches the query
//                 const review = JSON.parse(foodReview); //parse the body passed in by the POST request.
//                 for (const key in review) {
//                     document.Reviews[i][key] =
//                         review[key] === undefined ? document.reviews[i][key] : review[key]; // updates the review in the document if the property exists in the body passed from the POST request. Keeps it the same if undefined.
//                 }
//                 document.Reviews[i].overall = computeOverall(document.Reviews[i]); //recomputes overall with updated information
//                 database
//                     .collection('reviews')
//                     .updateOne(
//                         { DiningHall: diningHall },
//                         { $set: { Reviews: document.Reviews } },
//                         { upsert: true },
//                     ); // PUTS the document back into the db as update.
//                 return true;
//             }
//         }
//         return false;
//     } catch (error) {
//         console.error(error);
//     }
// }

// /**
//  *  delete an existing food review for a dining hall and returns it to the front-end.
//  * @param  {string} diningHallName -  the name of the diningName, ex "worcester"
//  * @param  {string} foodReviewID   -  the food review ID
//  * @return {boolean} found          -  whether we found a review with the matching food review ID
//  */
// async function deleteReview(diningHall: string, foodReviewID: string) {
//     const database = MongoDB.getRateMyDineDB();
//     const document = await database.collection('reviews').findOne({ DiningHall: diningHall }); // gets the dining hall requested in the body of the delete request
//     let found = false; // flag for loop
//     let i = undefined; // place holder

//     for (i = 0; i < (document !== null ? document.Reviews.length : 0); i++) {
//         // looping through the reviews of the dining hall for to find the corresponding id of the message to be deleted.
//         if (document !== null && document.Reviews[i].review_id === Number(foodReviewID)) {
//             found = true; //when found, set flag - break
//             break;
//         }
//     }

//     if (found && document !== null) {
//         // if flag is set
//         document.Reviews.splice(i, 1); // remove the review from the reviews array.
//         await database
//             .collection('reviews')
//             .updateOne(
//                 { DiningHall: diningHall },
//                 { $set: { Reviews: document.Reviews } },
//                 { upsert: true },
//             ); // PUT the updated document back into the database
//         await database
//             .collection('diningInfo')
//             .updateOne(
//                 { name: diningHall },
//                 { $set: { numReviews: document.Reviews.length } },
//                 { upsert: true },
//             ); // update the count with the length of reviews array.
//     }

//     return found;
// }

// /**
//  * find all the reviewID that belongs to the user
//  * @param  {string}  username          -  name of the user
//  * @return {Review Object[]} Reviews   -  an array of reviews that match with username
//  */
// async function findAllReviews(username: string) {
//     const database = MongoDB.getRateMyDineDB();
//     const reviewsArrayBelongToUSER = [];
//     const documents = await database.collection('reviews').find({}).toArray();
//     // iterate through each dining hall
//     for (let i = 0; i < documents.length; ++i) {
//         const diningHall = documents[i];
//         const reviewOfOneDiningHall = diningHall.Reviews;

//         // iterate through each reviews in a dining hall
//         for (let j = 0; j < reviewOfOneDiningHall.length; ++j) {
//             const review = reviewOfOneDiningHall[j];
//             if (review['reviewer_name'] === username) {
//                 // deconstructing the review
//                 // const { review_id, review_date, description, overall, FoodQuality, CustomerService, Atmosphere, Healthiness, SeatAvailability, Taste } = review;
//                 review.review_Date = createReviewDate(review.review_date);
//                 review.username = username;
//                 review.location = diningHall.DiningHall;
//                 // const reviewObject  = new Review(review_id, review_Date , username, overall, description,
//                 // FoodQuality, CustomerService, Atmosphere, Healthiness, SeatAvailability, Taste, diningHall.DiningHall);
//                 reviewsArrayBelongToUSER.push(review);
//             }
//         }
//     }
//     return JSON.stringify(reviewsArrayBelongToUSER);
// }

// exporting the function for use in other js files
// export { createReview, getReview, updateReview, deleteReview, findAllReviews };
export { createReview, getReview };
