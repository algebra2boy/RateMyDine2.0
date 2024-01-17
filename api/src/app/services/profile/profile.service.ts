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
