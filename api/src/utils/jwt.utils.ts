import jwt from 'jsonwebtoken';

const generateToken = (id: number): string => {
    const payload = { user: { id } };
    const secretKey = process.env.JWT_SECRET || 'secretCat';
    const expireTime = '1h';
    const jsonwebtoken = jwt.sign(payload, secretKey, { expiresIn: expireTime });

    return jsonwebtoken;
};

export { generateToken };
