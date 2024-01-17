import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/error.utils.js';
import { JwtError } from '../utils/error.utils.js';

/**
 * This middleware will intercept the error from the `express-jwt`, HttpError, or other potential errors.
 * Instead of returning the entire error log back, we return the specific
 * message and error back to the client.
 */
const ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error && error.name === 'UnauthorizedError' && error instanceof JwtError) {
        res.status(401).json({
            message: error.inner.message,
            status: 'error',
        });
    } else if (error && error instanceof HttpError) {
        res.status(error.errorCode).json(error.message);
    } else if (error) {
        res.status(500).json(error.message);
    } else {
        next();
    }
};

export default ErrorMiddleware;
