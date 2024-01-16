import { z, ZodNumber } from 'zod';

const FeedbackCriteria = (feedbackName: string): ZodNumber =>
    z
        .number()
        .int(`${feedbackName} must be an integer`)
        .min(1, `${feedbackName} should be an integer from 1 to 5`)
        .max(5, `${feedbackName} should be an integer between 1 to 5`);

export const reviewSchema = z.object({
    body: z.object({
        foodQuality: FeedbackCriteria('foodQuality'),
        customerService: FeedbackCriteria('customerService'),
        atmosphere: FeedbackCriteria('atmosphere'),
        healthiness: FeedbackCriteria('healthiness'),
        seatAvailability: FeedbackCriteria('seatAvailability'),
        taste: FeedbackCriteria('taste'),
        description: z
            .string()
            .min(1, 'description should not be empty')
            .max(200, 'description should be within 200 characters'),
    }),
});
