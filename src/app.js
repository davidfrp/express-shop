import 'dotenv/config'
import express from 'express';
import authRouter from './routers/authRouter.js';
import userRouter from './routers/userRouter.js';

const app = express();

const allowCors = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
};

app.use(express.json());
app.use(allowCors);

app.use(authRouter);
app.use(userRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});