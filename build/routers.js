import express from "express";
import userRouter from './routers/users.js';
import materialRouter from './routers/materials.js';
import priceRouter from './routers/prices.js';
export const router = express.Router();
router.use('/users', userRouter);
router.use('/materials', materialRouter);
router.use('/prices', priceRouter);
