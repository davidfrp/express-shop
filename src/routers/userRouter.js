import { Router } from 'express';
import storageService from '../services/storageService.js';
import jwtAuth from '../middleware/jwtAuth.js';

const userStorage = storageService('users');

const router = Router();

router.get('/users', jwtAuth, async (req, res) => {
    const users = await userStorage.findAll({}, ['id', 'username', 'email']);
    res.send(users);
});

router.get('/users/@me', jwtAuth, async (req, res) => {
    const user = await userStorage.findOne(
        { id: req.user.id }, 
        ['id', 'username', 'email']
    );
    res.send(user);
});

// router.get('/users/:id', async (req, res) => {
//     const user = await userStorage.findOne({
//         id: req.params.id
//     });
//     res.send(user);
// });

export default router;