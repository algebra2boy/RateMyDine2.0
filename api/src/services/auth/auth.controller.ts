import { Request, Response } from 'express';
import { Collection } from 'mongodb';
import { MongoDB } from '../../configs/mongodb.js';
import * as userService from './auth.service.js';
import { User } from './auth.model.js';

/**
 * Sign up a user
 * @authentication none
 * @route {POST} /api/auth/signup
 * @bodyparam
 *  - userName {string} : the name of user
 *  - email {string}: the email of user
 *  - password {string}: the password of user
 *  - firstName {string}: the first name of user
 *  - lastName {string}: the last name of user
 * @return a json body with message indicating whether it is successful
 */
const signUp = async (req: Request, res: Response) => {

    const UserCollection: Collection<User> = MongoDB.getRateMyDineDB().collection('users');

    const user = await userService.findUserByEmail(UserCollection, req.body.email);

    if (user) {
        // 403: Forbidden, server understands the request but refuses to authorize it.
        return res.status(403).json({ "message": `user with ${req.body.email} is already existed` })
    }

    try {
        await userService.createUser(UserCollection, req.body);
        res.status(201).json({ message: 'succesfully created an user' });
    } catch (error) {
        res.status(500).send({ status: "failure" });
    }
};

export { signUp };
