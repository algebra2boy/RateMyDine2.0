import { NextFunction, Request, Response } from 'express';

interface jwtError extends Error {
    inner: { "message": string }
}

/**
 * This middleware will intercept the error from the `express-jwt`.
 * Instead of returning the entire error log back, we return the specific
 * message and error back to the client.
 */
const ErrorMiddleware = (error: jwtError, req: Request, res: Response, next: NextFunction) => {
    if (error && error.name === 'UnauthorizedError') {
        return res.status(401).json({
            message: error.inner.message,
            status: 'error'
        });
    } else if (error) {
        return res.status(500).json(error.message);
    } else {
        next();
    }
};

export default ErrorMiddleware;
