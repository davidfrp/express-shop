import { Router } from 'express';
import storageService from '../services/storageService.js';

const productStorage = storageService('products');

const router = Router();

router.get('/products', async (req, res) => {
    const products = await productStorage.findAll(
        {}, 
        ['id', 'name', 'description', 'price']
    );
    res.send(products);
});

router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    if (id) {
        const product = await productStorage.findOne(
            { id }, 
            ['id', 'name', 'description', 'price']
        );

        if (product) {
            return res.send(product);
        }
    }

    res.sendStatus(404);
});

export default router;