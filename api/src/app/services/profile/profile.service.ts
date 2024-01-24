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

import { Request } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import { HttpError } from '../../utils/httpError.utils.js';
import { UserProfile } from './profile.model.js';
import status from 'http-status';

export async function findUserProfile(userName: string): Promise<UserProfile> {
    const database = MongoDB.getRateMyDineDB();
    const userInfo: UserProfile | null = await database
        .collection<UserProfile>('users')
        .findOne({ userName: userName });

    if (!userInfo) {
        throw new HttpError(status.NOT_FOUND, {
            message: `${userName} is not found in the database`,
        });
    }
    return userInfo;
}

export async function updateUserInfo(currentUserName: string, req: Request) {
    const userProfile: UserProfile = await findUserProfile(currentUserName);
    const { fullName, userName, email } = req.body; // new user's updated info
    
    await update(fullName, userName, email);

    return userProfile;
}

async function update(fullName: string, userName: string, email: string): Promise<void> {
    const database = MongoDB.getRateMyDineDB();
    const userCollection = database.collection<UserProfile>("users");

    const filter = { "userName": userName };
    const update = {
        $set: {
            fullName: fullName,
            email: email
        }
    };

    await userCollection.updateOne(filter, update);
}
