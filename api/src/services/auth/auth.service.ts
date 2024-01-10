import { Collection } from 'mongodb';
import { UserSignUpBody } from './auth.model.js';
import { User } from './auth.model.js';

async function createUser(userCollection: Collection<User>, body: UserSignUpBody) {
    const { userName, email, password, firstName, lastName } = body;
    await userCollection.insertOne({
        userName: userName,
        email: email,
        password: password,
        fullName: firstName + ' ' + lastName,
    });
};

async function findUserByEmail(userCollection: Collection<User>, email: String) {
    try {
        const user = await userCollection.findOne({ email: email });
        return user != null;
    } catch (error) {
        return false;
    }
}

export {
    findUserByEmail,
    createUser
};
