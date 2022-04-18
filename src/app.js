import 'dotenv/config'
import express from 'express';
import allowCors from './middleware/allowCors.js';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';

const app = express();

app.use(express.json());
app.use(allowCors);

app.options('*', allowCors);

app.use(authRouter);
app.use(userRouter);

app.get('*', (req, res) => {
    res.sendStatus(404);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});