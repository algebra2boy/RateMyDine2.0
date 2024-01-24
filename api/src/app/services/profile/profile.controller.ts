// find all the review that belongs to the user
// reviewRouter.get('/review/user/:username', async (req, res) => {
//     let username = req.params.username;
//     let result = await dbUtils.findAllReviews(username);
//     res.send(result);
// });

import { NextFunction, Request, Response } from 'express';

import * as profileService from "./profile.service.js";
import status from "http-status";

/**
 * Get the information of a user including its fullname, email and username
 */
const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.params.userName;

    try {
        const userInfo = await profileService.findUserProfile(userName);
        res.status(status.OK).json(userInfo);
    } catch (error) {
        next(error);
    }
};

/**
 * Update the information of a user including its fullname, email and username
 */
const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    const userName = req.params.userName;
    
    try {
        const updatedUserInfo = await profileService.updateUserInfo(userName, req);
        res.status(status.OK).json(updatedUserInfo);
    } catch (error) {
        next(error);
    }

};


export {
    getUserInfo,
    updateUserInfo
};