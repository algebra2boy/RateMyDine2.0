import { Collection, ObjectId } from 'mongodb';
import { UserSignUpBody } from './auth.model.js';
import { User } from './auth.model.js';

async function createUser(userCollection: Collection<User>, body: UserSignUpBody): Promise<User> {
    const { userName, email, password, firstName, lastName } = body;

    const newUser: User = {
        _id: new ObjectId(),
        userName: userName,
        email: email,
        password: password,
        fullName: firstName + ' ' + lastName,
    };

    await userCollection.insertOne(newUser);
    return newUser;
}

async function findUserByEmail(
    userCollection: Collection<User>,
    email: string,
): Promise<User | null> {
    try {
        const user: User | null = await userCollection.findOne({ email: email });
        return user;
    } catch (error) {
        return null;
    }
}

async function validatePassword(user: User, password: string): Promise<boolean> {
    try {
        return user.password === password;
    } catch (error) {
        return false;
    }
}

export { findUserByEmail, createUser, validatePassword };
