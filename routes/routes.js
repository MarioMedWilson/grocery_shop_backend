import express from "express";
import { Router } from 'express';

import userRouter from './userRoutes.js';
import product from '../controllers/product.js';
import countries from "../controllers/countries.js";

const app = express();

app.use('/', userRouter);
app.get('/countries', countries.countriesData);
app.get('/products', product.showProducts);

export default app;
