import { Router } from 'express';
import { jwtAuthenticator } from '../services/authService.js';
import userService from '../services/userService.js';

const router = Router();

router.use(jwtAuthenticator());

router.get('/users', async (req, res) => {
    const users = await userService.findAll();
    res.send(users);
});

router.get('/users/@me', async (req, res) => {
    const user = await userService.findOne({ id: req.user.id });
    res.send(user);
});

// router.get('/users/:id', async (req, res) => {
//     const user = await userService.findOne({
//         id: req.params.id
//     });
//     res.send(user);
// });

export default router;