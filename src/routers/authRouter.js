import { Router } from 'express';
import userService from '../services/userService.js';
import authService from '../services/authService.js';

const router = Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await userService.findOneDangerously({ email });
    const hash = user?.password || '';

    const isValid = await authService.comparePasswords(password, hash);

    if (isValid) {
        const token = authService.issueToken(user);
        return res.send({ token });
    }

    res.status(400).send({ message: '400: Bad Request' });
});

router.post('/auth/register', async (req, res) => {
    try {
        await userService.create(req.body);
        res.status(204).send();
    } catch (err) {
        res.status(400).send({ code: err.cause, message: err.message });
    }
});

export default router;