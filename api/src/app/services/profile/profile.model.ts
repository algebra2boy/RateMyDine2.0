import { WithId } from 'mongodb';

export interface UserProfile extends WithId<Document> {
    userName: string;
    email: string;
    password: string;
    fullName: string;
}
