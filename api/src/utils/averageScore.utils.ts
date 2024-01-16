import { Feedback } from '../services/reviews/reviews.model.js';

/**
 * Compute the overall stars that is the average of other six fields.
 * @param  {Feedback} feedback - the feedback from a user
 * @return {float} average of the review
 */
export function computeAverageScore(feedback: Feedback): number {
    const { foodQuality, customerService, atmosphere, healthiness, seatAvailability, taste } =
        feedback;
    const sum =
        100 *
        ((foodQuality + customerService + atmosphere + healthiness + seatAvailability + taste) / 5);
    return Math.ceil(Math.ceil(sum / 6) * 0.01 * 5); // rounding up for the rendering of overall stars.
}
