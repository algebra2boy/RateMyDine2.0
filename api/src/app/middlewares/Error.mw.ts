import { NextFunction, Request, Response } from 'express';
import status from 'http-status';

import { HttpError } from '../utils/httpError.utils.js';

interface JwtError extends Error {
    inner: { message: string };
}

/**
 * This middleware will intercept the error from the `express-jwt`, HttpError, or other potential errors.
 * Instead of returning the entire error log back, we return the specific
 * message and error back to the client.
 */
const ErrorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error && error.name === 'UnauthorizedError') {
        res.status(status.UNAUTHORIZED).json({
            message: (error as JwtError).inner.message,
            status: 'failure',
        });
    } else if (error && error instanceof HttpError) {
        res.status(error.errorCode).json({
            message: error.message,
            status: 'failure',
        });
    } else if (error) {
        res.status(status.INTERNAL_SERVER_ERROR).json({
            message: error.message,
            status: 'failure',
        });
    } else {
        next();
    }
};

export default ErrorMiddleware;
