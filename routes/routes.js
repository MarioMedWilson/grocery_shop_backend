import express from "express";
import adminRouter from './sellerRoutes.js';
import userRouter from './userRoutes.js';

const routes = express();
routes.use('/user', userRouter);
routes.use('/seller', adminRouter);


export default routes;
