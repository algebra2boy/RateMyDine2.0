import { Request, Response } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import * as userService from './auth.service.js';

// interface
import { Collection } from 'mongodb';
import { User } from './auth.model.js';

/**
 * Login for a user
 * @authentication none
 * @route {POST} /api/auth/login
 * @bodyparam
 *  - email {string}: the email of user
 *  - password {string}: the password of user
 * @return a json body with message indicating whether login is successful
 */
const login = async (req: Request, res: Response) => {
    const userCollection: Collection<User> = MongoDB.getRateMyDineDB().collection('users');

    const user = await userService.findUserByEmail(userCollection, req.body.email);

    if (!user) {
        return res.status(404).json({ message: `user with ${req.body.email} is not found` });
    }

    const isPasswordCorrect: boolean = await userService.validatePassword(user, req.body.password);

    if (!isPasswordCorrect) {
        res.status(401).json({ message: `user with ${req.body.email} has incorrect password` });
    } else {
        res.status(200).json({ user });
    }
};

/**
 * Sign up a user
 * @authentication none
 * @route {POST} /api/auth/signup
 * @bodyparam body UserSignUpBody
 * @return a json body with message indicating whether sign up is successful
 */
const signUp = async (req: Request, res: Response) => {
    const userCollection: Collection<User> = MongoDB.getRateMyDineDB().collection('users');

    const existingUser = await userService.findUserByEmail(userCollection, req.body.email);

    if (existingUser) {
        // 403: Forbidden, server understands the request but refuses to authorize it.
        return res.status(403).json({ message: `user with ${req.body.email} is already existed` });
    }

    try {
        const user = await userService.createUser(userCollection, req.body);
        res.status(201).json({ user });
    } catch (error) {
        res.status(500).send({ status: 'failure' });
    }
};

export { signUp, login };
