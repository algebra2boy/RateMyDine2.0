import { Collection, ObjectId } from 'mongodb';
import { UserSignUpBody } from './auth.model.js';
import { User, UserWithToken } from './auth.model.js';
import { generateToken } from '../../utils/jwt.utils.js';
import { HttpError } from '../../utils/httpError.utils.js';

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
): Promise<UserWithToken> {
    const user: User | null = await userCollection.findOne({ email: email });

    if (!user) throw new HttpError(404, { message: `user with ${email} is not found` });

    return {
        ...user,
        token: generateToken(user._id),
    };
}

function validatePassword(user: User, password: string): boolean {
    return user.password === password;
}

export { findUserByEmail, createUser, validatePassword };
