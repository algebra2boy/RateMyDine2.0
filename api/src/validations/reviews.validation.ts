import { z } from "zod";

export const reviewSchema = z.object({
    body: z.object({
        FoodQuality: z.string().min(1, 'FoodQuality should be an integer from 1 to 5').max(1, "FoodQuality should be an integer between 1 to 5"),
        CustomerService: z.string().min(1, 'CustomerService should be an integer from 1 to 5').max(1, "CustomerService should be an integer between 1 to 5"),
        Atmosphere: z.string().min(1, 'Atmosphere should be an integer from 1 to 5').max(1, "Atmosphere should be an integer between 1 to 5"),
        Healthiness: z.string().min(1, 'Healthiness should be an integer from 1 to 5').max(1, "Healthiness should be an integer between 1 to 5"),
        SeatAvailability: z.string().min(1, 'SeatAvailability should be an integer from 1 to 5').max(1, "SeatAvailability should be an integer between 1 to 5"),
        Taste: z.string().min(1, 'Taste should be an integer from 1 to 5').max(1, "Taste should be an integer between 1 to 5"),
        // ReviewDescription: z.string().min(1, 'ReviewDescription should not be empty').max(200, "ReviewDescription should be within 200 characters"),
    }),
});

