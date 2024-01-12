import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const generateToken = (id: ObjectId): string => {
    const payload = { user: { id } };

    // TODO: JWT_SECRET exists here 
    // const secretKey = process.env.JWT_SECRET || 'secretCat';
    const secretKey = "secretCat";
    const expireTime = '1h';
    return jwt.sign(payload, secretKey, { expiresIn: expireTime });
};

export { generateToken };
