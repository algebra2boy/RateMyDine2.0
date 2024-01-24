import { WithId } from 'mongodb';

// extends to WithID<Document> automatically includes the _id field
export interface DiningInfo extends WithId<Document> {
    address: string;
    phone: string;
    description: string;
    numReviews: number;
    name: string;
    mapURL: string;
    hours: [string];
}

type FeedbackScore = 1 | 2 | 3 | 4 | 5;

export interface Feedback {
    description: string;
    foodQuality: FeedbackScore;
    customerService: FeedbackScore;
    atmosphere: FeedbackScore;
    healthiness: FeedbackScore;
    seatAvailability: FeedbackScore;
    taste: FeedbackScore;
}

export interface Review {
    review_id: number;
    review_date: string;
    reviewer_name: string;
    overall: number;
    feedback: Feedback;
    location: string;
}

export interface DiningHallReview extends WithId<Document> {
    Reviews: Review[];
    DiningHall: string;
}
