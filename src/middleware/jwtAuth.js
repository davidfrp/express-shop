import jwt from 'jsonwebtoken';

export default async (req, res, next) => {
    const secret = process.env.JWT_SECRET;
    const authHeader = req.headers?.authorization; // Authorization: Bearer <token>
    const token = authHeader?.split(' ').pop();

    if (token) {
        try {
            const decoded = jwt.verify(token, secret);
            req.user = {
                id: decoded.sub,
                username: decoded.name
            };
            next();
        } catch(err) {
            console.log(err);
            return res.status(401).send({ message: 'Bad credentials' });
        }
    } else {
        return res.status(401).send({ message: 'Requires authentication' });
    }
};