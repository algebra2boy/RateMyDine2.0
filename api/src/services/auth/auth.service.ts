import { Collection, ObjectId } from 'mongodb';
import { UserSignUpBody } from './auth.model.js';
import { User, UserWithToken } from './auth.model.js';
import { generateToken } from '../../utils/jwt.utils.js';

async function createUser(
    userCollection: Collection<User>,
    body: UserSignUpBody,
): Promise<UserWithToken> {
    const { userName, email, password, firstName, lastName } = body;

    const newUser: User = {
        _id: new ObjectId(),
        userName: userName,
        email: email,
        password: password,
        fullName: firstName + ' ' + lastName,
    };

    await userCollection.insertOne(newUser);

    return {
        ...newUser,
        token: generateToken(newUser._id),
    };
}

async function findUserByEmail(
    userCollection: Collection<User>,
    email: string,
): Promise<UserWithToken | null> {
    try {
        const user: User | null = await userCollection.findOne({ email: email });

        if (!user) return null;

        return {
            ...user,
            token: generateToken(user._id),
        };
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
