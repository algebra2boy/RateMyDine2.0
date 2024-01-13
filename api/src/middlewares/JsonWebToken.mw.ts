import { expressjwt } from 'express-jwt';

/**
 * This object contains two middlwares for validating JWT through the `jsonwebtoken` module.
 * An encryption algortihm, HS256, is used.
 */
const jwtMiddleware = {
    required: expressjwt({
        secret: process.env.JWT_SECRET || 'secretCat', // secret key to encode jwt
        algorithms: ['HS256'], // specify the algorithm
    }),
    optional: expressjwt({
        secret: process.env.JWT_SECRET || 'secretCat',
        algorithms: ['HS256'],
        credentialsRequired: false,
    }),
};
console.log("running from middleware");
console.log(process.env.JWT_SECRET);

export default jwtMiddleware;
