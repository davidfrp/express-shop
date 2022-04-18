import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default {
    comparePasswords: (password, hash) => {
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
            { expiresIn: '1h' }
        );
    }
};