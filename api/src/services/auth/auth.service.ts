import { Collection, WithId } from 'mongodb';
import { UserSignUpBody } from './auth.model.js';
import { User } from './auth.model.js';

async function createUser(userCollection: Collection<User>, body: UserSignUpBody): Promise<void> {
    const { userName, email, password, firstName, lastName } = body;
    await userCollection.insertOne({
        userName: userName,
        email: email,
        password: password,
        fullName: firstName + ' ' + lastName,
    });
}

async function findUserByEmail(
    userCollection: Collection<User>,
    email: string,
): Promise<WithId<User> | null> {
    try {
        const user: WithId<User> | null = await userCollection.findOne({ email: email });
        return user;
    } catch (error) {
        return null;
    }
}

async function validatePassword(user: WithId<User>, password: string): Promise<boolean> {
    try {
        return user.password === password;
    } catch (error) {
        return false;
    }
}

export { findUserByEmail, createUser, validatePassword };
