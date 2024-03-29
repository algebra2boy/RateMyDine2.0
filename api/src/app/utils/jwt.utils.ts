import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

const generateToken = (id: ObjectId): string => {
    const payload = { user: { id } };
    const secretKey = process.env.JWT_SECRET || 'secretCat';
    const expireTime = '4h';
    return jwt.sign(payload, secretKey, { expiresIn: expireTime });
};

export { generateToken };
