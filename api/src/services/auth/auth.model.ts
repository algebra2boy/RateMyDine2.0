import { ObjectId } from 'mongodb';

export interface UserSignUpBody {
    userName: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface User {
    _id: ObjectId;
    userName: string;
    email: string;
    password: string;
    fullName: string;
}

export interface UserWithToken extends User {
    token: string;
}
