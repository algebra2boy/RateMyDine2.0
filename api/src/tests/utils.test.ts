import { Feedback } from "../app/services/reviews/reviews.model.js";
import { computeAverageScore } from "../../src/app/utils/computeScore.utils.js";

describe("test compute score utils function", () => {
    it("test feedback with all one star rating", () => {
        const feedback: Feedback = {
            description: "abc",
            foodQuality: 1,
            customerService: 1,
            atmosphere: 1,
            healthiness: 1,
            seatAvailability: 1,
            taste: 1
        }
        const score: number = computeAverageScore(feedback);

        expect(score).toEqual(1);
    });
})