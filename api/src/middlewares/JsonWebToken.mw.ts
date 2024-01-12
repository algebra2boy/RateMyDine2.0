import { expressjwt } from 'express-jwt';

/**
 * This object contains two middlwares for validating JWT through the `jsonwebtoken` module.
 * An encryption algortihm, HS512, is used.
 * credentialsRequired is used to provide access to unregistered users.
 * credentialsRequired: it will continues to the next middleware if the request does not
 * contain a token if it is false
 */
const jwtMiddleware = {
    required: expressjwt({
        secret: process.env.JWT_SECRET || 'secretCat',
        algorithms: ['HS512'],
    }),
    optional: expressjwt({
        secret: process.env.JWT_SECRET || 'secretCat',
        algorithms: ['HS512'],
        credentialsRequired: false,
    }),
};

export default jwtMiddleware;
