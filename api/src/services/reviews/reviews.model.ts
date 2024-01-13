import { ObjectId } from 'mongodb';

export interface DiningInfo {
    _id: ObjectId;
    address: string;
    phone: string;
    description: string;
    numReviews: number;
    name: string;
    mapURL: string;
    hours: [string];
}

export interface Review {
    FoodQuality: string;
    CustomerService: string;
    Atmosphere: string;
    Healthiness: string;
    SeatAvailability: string;
    Taste: string;
    ReviewDescription: string;
}