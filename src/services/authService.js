import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const jwtAuthenticator = (query) => {
    
    const secret = process.env.JWT_SECRET;

    return async (req, res, next) => {
        const authHeader = req.headers?.authorization; // Authorization: Bearer <token>
        const token = authHeader?.split(' ').pop();

        try {
            const decoded = jwt.verify(token, secret);
            if (query) {
                for (const [key, value] of Object.entries(query)) {
                    if (decoded[key] !== value) {
                        throw new Error();
                    }
                }
            }
            req.user = {
                id: decoded.sub,
                username: decoded.name
            };
            next();
        } catch (err) {
            return res.status(401).send({ message: '401: Unauthorized' });
        }
    };
};

export default {
    comparePasswords: (password, hash) => {
        console.log(password, hash);
        return bcrypt.compare(password, hash);
    },
    hashPassword: (password) => {
        return bcrypt.hash(password, 10);
    },
    issueToken: (user) => {
        const payload = { 
            sub: user.id, 
            name: user.username, 
            iat: Math.floor(Date.now() / 1000)
        };
        
        return jwt.sign(
            payload, 
            process.env.JWT_SECRET, 
            { expiresIn: '1m' }
        );
    }
};