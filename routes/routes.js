import express from "express";
import { Router } from 'express';
import adminRouter from './sellerRoutes.js';
import userRouter from './userRoutes.js';

import countries from "../controllers/countries.js";

const app = express();

app.use('/user', userRouter);
app.use('/seller', adminRouter);
app.get('/countries', countries.countriesData);

export default app;
