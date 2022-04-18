import { Router } from 'express';
import storageService from '../services/storageService.js';
import authService from '../services/authService.js';

const userStorage = storageService('users');

const router = Router();

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    
    const user = await userStorage.findOne({ email });
    const hash = user?.password || '';

    const isValid = await authService.comparePasswords(password, hash);

    if (isValid) {
        const token = authService.issueToken(user);
        return res.send({ token });
    }

    res.status(400).send({
        code: 'PASSWORD_INVALID',
        message: 'Wrong email or password.'
    });
});

router.post('/auth/register', async (req, res) => {
    const { username, password, email } = req.body;

    if (username === undefined || 
        password === undefined || 
        email === undefined) {
        return res.status(400).send({
            message: 'Request body is malformed'
        });
    }

    const isEmailAvailable = await userStorage.findOne({ email }) === undefined;

    if (!isEmailAvailable) {
        return res.status(400).send({
            code: 'EMAIL_ALREADY_REGISTERED',
            message: 'Email already registered'
        });
    }
    
    const isUsernameAvailable = await userStorage.findOne({ username }) === undefined;

    if (!isUsernameAvailable) {
        return res.status(400).send({
            code: 'USERNAME_TAKEN',
            message: 'Username already taken'
        });
    }

    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/.test(password)) {
        return res.status(400).send({
            code: 'PASSWORD_TOO_WEAK',
            message: 'Password is too weak'
        });
    }

    const hash = await authService.hashPassword(password);

    await userStorage.create({ email, username, password: hash });
    res.status(204).send();
});

export default router;