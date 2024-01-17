import { NextFunction, Request, Response } from 'express';
import { MongoDB } from '../../configs/mongodb.js';
import * as userService from './auth.service.js';

// interface
import { Collection } from 'mongodb';
import { User } from './auth.model.js';
import { HttpError } from '../../utils/httpError.utils.js';

/**
 * Login for a user
 * @authentication none
 * @route {POST} /api/auth/login
 * @bodyparam
 *  - email {string}: the email of user
 *  - password {string}: the password of user
 * @return a json body with message indicating whether login is successful
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCollection: Collection<User> = MongoDB.getRateMyDineDB().collection('users');

        const user = await userService.findUserByEmail(userCollection, req.body.email);

        const isPasswordCorrect: boolean = userService.validatePassword(user, req.body.password);

        if (!isPasswordCorrect) {
            throw new HttpError(401, {
                message: `user with ${req.body.email} has incorrect password`,
            });
        } else {
            res.status(200).json({ user });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Sign up a user
 * @authentication none
 * @route {POST} /api/auth/signup
 * @bodyparam body UserSignUpBody
 * @return a json body with message indicating whether sign up is successful
 */
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCollection: Collection<User> = MongoDB.getRateMyDineDB().collection('users');

        const existingUser = await userService.findUserByEmail(userCollection, req.body.email);

        if (existingUser) {
            throw new HttpError(403, { message: `user with ${req.body.email} is already existed` });
        }

        const user = await userService.createUser(userCollection, req.body);
        res.status(201).json({ user });
    } catch (error) {
        next(error);
    }
};
