import { Feedback } from '../app/services/reviews/reviews.model.js';
import { computeAverageScore } from '../../src/app/utils/computeScore.utils.js';
import { createReviewDate } from '../app/utils/date.utils.js';

describe('test compute score utils function', () => {
    it('test feedback with all one star rating', () => {
        const feedback: Feedback = {
            description: 'abc',
            foodQuality: 1,
            customerService: 1,
            atmosphere: 1,
            healthiness: 1,
            seatAvailability: 1,
            taste: 1,
        };
        const score: number = computeAverageScore(feedback);

        expect(score).toEqual(1);
    });

    it('test feedback with all five stars rating', () => {
        const feedback: Feedback = {
            description: 'abc',
            foodQuality: 5,
            customerService: 5,
            atmosphere: 5,
            healthiness: 5,
            seatAvailability: 5,
            taste: 5,
        };
        const score: number = computeAverageScore(feedback);

        expect(score).toEqual(5);
    });

    it('test feedback with a mixed stars rating', () => {
        const feedback: Feedback = {
            description: 'abc',
            foodQuality: 5,
            customerService: 1,
            atmosphere: 2,
            healthiness: 3,
            seatAvailability: 4,
            taste: 5,
        };
        const score: number = computeAverageScore(feedback);

        expect(score).toEqual(4);
    });
});

describe('test create review date', () => {
    it('2023-05-17', () => {
        const date = createReviewDate('2023-05-17T20:02:07.544Z');
        expect(date).toEqual('May 18, 2023');
    });
    it('2024-01-18', () => {
        const date = createReviewDate('2024-01-18T10:51:02.111Z');
        expect(date).toEqual('Jan 18, 2024');
    });
});
