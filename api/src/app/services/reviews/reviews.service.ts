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
    const diningHallReview: DiningHallReview = await getDiningHallReview(diningHall);

    const reviews: Review[] = diningHallReview.Reviews;
    const newFoodReview: Review = constructFoodReview(reviews, diningHall, feedback, username);

    await updateDiningHallDocument(database, diningHall, [newFoodReview, ...reviews]);
    await updateReviewCount(database, diningHall, true);

    const updatedReviews = await getDiningHallReview(diningHall);
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
 * @param {boolean} isIncrementing - true for increasing the review count; otherwise, decreasing
 */
async function updateReviewCount(
    database: Db,
    diningHall: string,
    isIncrementing: boolean,
): Promise<void> {
    const diningInfo: DiningInfo = await findDiningInfo(diningHall);

    const filter = { name: diningHall };
    const updateDoc = {
        $set: {
            numReviews: isIncrementing ? diningInfo.numReviews + 1 : diningInfo.numReviews - 1,
        },
    };

    await database.collection('diningInfo').updateOne(filter, updateDoc);
}

/**
 * Gets all the user reviews for a particular dining hall and returns it to the front-end.
 * @param  {string} diningHall - the name of the dinning hall.
 * @return {Promise<Review[]>} reviews from all the diningHall.
 * @throws {HttpError} Throws an error if cannot find any review.
 */
export async function getReview(diningHall: string): Promise<Review[]> {
    const diningHallReview: DiningHallReview = await getDiningHallReview(diningHall);

    const reviews: Review[] = diningHallReview.Reviews;
    return reviews.map(review => {
        return {
            ...review,
            review_date: createReviewDate(review.review_date), // convert the date
        };
    });
}

/**
 * Gets all the dining hall reviews for a particular dining hall
 * @param  {string} diningHall - the name of the dinning hall.
 * @return {Promise<DiningHallReview>} dining hall reviews document
 * @throws {HttpError} Throws an error if cannot find any dining hall.
 */
async function getDiningHallReview(diningHall: string): Promise<DiningHallReview> {
    const database = MongoDB.getRateMyDineDB();
    const document = await database
        .collection<DiningHallReview>('reviews')
        .findOne({ DiningHall: diningHall });

    if (!document) {
        throw new HttpError(status.NOT_FOUND, {
            message: `${diningHall} does not exist in the reviews collection`,
        });
    }

    return document;
}

/**
 * updates an existing food review for a dining hall and returns it to the front-end.
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
    const diningHallReview: DiningHallReview = await getDiningHallReview(diningHall);

    // loops through the reviews of the dining hall and tries to find the matching post id.
    const reviews: Review[] = diningHallReview.Reviews;
    const review: Review | undefined = reviews.find(
        review => review.review_id === Number(foodReviewID),
    );

    if (!review) {
        throw new HttpError(status.NOT_FOUND, {
            message: `review with reviewID ${foodReviewID} does not exist in the database`,
        });
    }

    review.feedback = feedback; // replace the old feedback with new feedback
    review.overall = computeAverageScore(feedback); // recomputes overall with updated information
    await updateReiewCollection(database, diningHall, reviews);

    return review;
}

/**
 * puts the document back into the database as update.
 * @param {Db} database - The mongodb database for RateMyDine
 * @param {string} diningHall - the dining hall name
 * @param {Review[]} reviews - new reviews from the dining hall
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

/**
 * deletes an existing food review for a dining hall and returns it to the front-end.
 * @param  {string} diningHall - the name of the diningName, ex "worcester"
 * @param  {string} foodReviewID - the food review ID
 * @throws {HttpError} Throws an error if dining hall does not exist.
 */
export async function deleteReview(diningHall: string, foodReviewID: string): Promise<void> {
    const database = MongoDB.getRateMyDineDB();
    const diningHallReview: DiningHallReview = await getDiningHallReview(diningHall);

    const reviews: Review[] = diningHallReview.Reviews;
    const filteredReviews = reviews.filter(review => review.review_id !== Number(foodReviewID));

    if (filteredReviews.length === reviews.length) {
        throw new HttpError(status.NOT_FOUND, {
            message: `review with reviewID ${foodReviewID} does not exist in the database`,
        });
    }

    await updateReiewCollection(database, diningHall, filteredReviews);
    await updateReviewCount(database, diningHall, false);
}
