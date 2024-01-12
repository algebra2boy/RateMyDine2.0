import { NextFunction, Request, Response } from 'express';

/**
 * This middleware will intercept the error from the `express-jwt`
 * instead of returning the entire error log back, we return our own custom
 * message and error back to the client.
 */
const ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error && error.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: 'invalid or missing authorization credentials in the request header',
            status: 'error',
        });
    } else if (error) {
        return res.status(500).json(error.message);
    } else {
        next();
    }
};

export default ErrorMiddleware;