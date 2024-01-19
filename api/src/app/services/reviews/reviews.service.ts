import { Collection, Db } from 'mongodb';
import status from 'http-status';

import { MongoDB } from '../../configs/mongodb.js';
import { DiningHallReview, DiningInfo, Feedback, Review } from './reviews.model.js';
import { createReviewDate } from '../../utils/date.utils.js';
import { computeAverageScore } from '../../utils/computeScore.utils.js';
import { HttpError } from '../../utils/httpError.utils.js';

/**
 * Get the information about every dining hall info.
 * @returns {Promise<DiningInfo[]>} an array of dining hall info document
 */
export async function findAllDiningInfo(): Promise<DiningInfo[]> {
    const collection: Collection<DiningInfo> = MongoDB.getRateMyDineDB().collection('diningInfo');
    const diningInfo: DiningInfo[] = await collection.find({}).toArray();

    return diningInfo;
}

/**
 * Get the information about a dining hall info.
 * @param {string} diningHall - the name of the dining hall.
 * @returns {Promise<DiningInfo>} the dining hall info document.
 * @throws {HttpError} Throws an error if dining hall does not exist.
 */
export async function findDiningInfo(diningHall: string): Promise<DiningInfo> {
    const collection: Collection<DiningInfo> = MongoDB.getRateMyDineDB().collection('diningInfo');
    const diningInfo: DiningInfo | null = await collection.findOne({ name: diningHall });

    // Dining Hall information doesn't exist
    if (!diningInfo) {
        throw new HttpError(status.NOT_FOUND, {
            message: `${diningHall} does not exist in the diningInfo collection`,
        });
    }

    return diningInfo;
}

/**
 * Adds a new review to the dining hall in the database using user's feedback and name
 * @param {string} diningHall - the name of the dining hall
 * @param {Feedback} feedback - the user food feedback
 * @param {string} username - the user name
 * @returns {Promise<DiningHallReview | null>} the dining hall info review document
 * @throws {HttpError} Throws an error if dining hall does not exist.
 */
export async function createReview(
    diningHall: string,
    feedback: Feedback,
    username: string,
): Promise<DiningHallReview | null> {
    const database: Db = MongoDB.getRateMyDineDB();
    const document = await database
        .collection<DiningHallReview>('reviews')
        .findOne({ DiningHall: diningHall });

    if (!document) {
        throw new HttpError(status.NOT_FOUND, {
            message: `${diningHall} does not exist in the reviews collection`,
        });
    }

    const reviews: Review[] = document.Reviews;
    const newFoodReview: Review = constructFoodReview(reviews, diningHall, feedback, username);

    await updateDiningHallDocument(database, diningHall, [newFoodReview, ...reviews]);
    await updateReviewCount(database, diningHall);

    const updatedReviews = await database
        .collection<DiningHallReview>('reviews')
        .findOne({ DiningHall: diningHall });
    return updatedReviews;
}

/**
 * Constructs a food review using user's feedback.
 * @param {Review[]} reviews - all the reviews from the review collection for the diningHall.
 * @param {string} diningHall - the name of the dinningHall.
 * @param {Feedback} feedback - the user's feedback including foodQuality, customerService from the request body.
 * @param {string} username - the name of the reviewer.
 * @returns {Review} the review object.
 */
function constructFoodReview(
    reviews: Review[],
    diningHall: string,
    feedback: Feedback,
    username: string,
): Review {
    return {
        review_id: reviews[0] ? reviews[0]['review_id'] + 1 : 1,
        review_date: new Date(Date.now()).toISOString(),
        reviewer_name: username,
        overall: computeAverageScore(feedback),
        feedback,
        location: diningHall,
    };
}

/**
 * Puts the updated dining hall document in the review collection
 *
 * @param {Db} database - The mongodb database for RateMyDine
 * @param {string} diningHall - the name of the dining hall
 * @param {Review[]} reviews - the updated version of review array
 */
async function updateDiningHallDocument(
    database: Db,
    diningHall: string,
    reviews: Review[],
): Promise<void> {
    const filter = { DiningHall: diningHall }; // specify which dining hall we want to insert the new review to
    const updateDoc = { $set: { Reviews: reviews } }; // $set operator is used here to replace the value of the Reviews field with the new reviews

    await database.collection('reviews').updateOne(filter, updateDoc);
}

/**
 * Update the number of reviews in the diningInfo
 * @param {Db} database -  The mongodb database for RateMyDine
 * @param {string} diningHall - the name of the dining hall
 */
async function updateReviewCount(database: Db, diningHall: string): Promise<void> {
    const diningInfo: DiningInfo = await findDiningInfo(diningHall);

    const filter = { name: diningHall };
    const updateDoc = {
        $set: { numReviews: diningInfo.numReviews + 1 },
    };

    await database.collection('diningInfo').updateOne(filter, updateDoc);
}

/**
 * Gets all the reviews for a particular dining hall and returns it to the front-end.
 * @param  {string} diningHall - the name of the dinning hall.
 * @return {Promise<Review[]>} reviews from all the diningHall.
 * @throws {HttpError} Throws an error if cannot find any review.
 */
export async function getReview(diningHall: string): Promise<Review[]> {
    const database: Db = MongoDB.getRateMyDineDB();
    const result = await database
        .collection<DiningHallReview>('reviews')
        .findOne({ DiningHall: diningHall });

    if (!result || !result.Reviews) {
        throw new HttpError(status.NOT_FOUND, {
            message: `server cannot find any reviews from ${diningHall}`,
        });
    }

    // loop over every review for that dining hall
    const review: Review[] = [];
    for (const comment of result.Reviews) {
        comment.review_date = createReviewDate(comment.review_date); // convert the date
        review.push(comment);
    }
    return review;
}

/**
 * update an existing food review for a dining hall and returns it to the front-end.
 * @param  {string} diningHall - the name of the diningName, ex "Worcester"
 * @param  {Feedback} feedback - the user's feedback including foodQuality, customerService
 * @param  {string} foodReviewID - the food review ID
 * @return {Promise<Review>} the new updated review
 * @throws {HttpError} Throws an error if dining hall does not exist.
 */
export async function updateReview(
    diningHall: string,
    feedback: Feedback,
    foodReviewID: string,
): Promise<Review> {
    const database: Db = MongoDB.getRateMyDineDB();
    const document = await database
        .collection<DiningHallReview>('reviews')
        .findOne({ DiningHall: diningHall });

    if (!document) {
        throw new HttpError(status.NOT_FOUND, {
            message: `${diningHall} does not exist in the reviews collection`,
        });
    }

    // loops through the reviews of the dining hall and tries to find the matching post id.
    const reviews: Review[] = document.Reviews;
    for (let i = 0; i < reviews.length; ++i) {
        const review: Review = reviews[i];

        if (review.review_id === Number(foodReviewID)) {
            review.feedback = feedback; // replace the old feedback with new feedback
            review.overall = computeAverageScore(feedback); // recomputes overall with updated information

            await updateReiewCollection(database, diningHall, reviews);
            return review;
        }
    }

    throw new HttpError(status.NOT_FOUND, {
        message: `review with reviewID ${foodReviewID} does not exist in the database`,
    });
}

/**
 * PUTS the document back into the database as update.
 * @param {Db} database - The mongodb database for RateMyDine
 * @param {string} diningHall - the dining hall name
 * @param {Review[]} reviews - reviews from the dining hall
 */
async function updateReiewCollection(
    database: Db,
    diningHall: string,
    reviews: Review[],
): Promise<void> {
    const filter = { DiningHall: diningHall };
    const update = { $set: { Reviews: reviews } };
    const option = { upsert: true };

    await database.collection('reviews').updateOne(filter, update, option);
}

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
