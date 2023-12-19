import express from "express";
import { Router } from 'express';

import userRouter from './userRoutes.js';
import product from '../controllers/product.js';
import countries from "../controllers/countries.js";

const app = express();

app.use('/', userRouter);
app.get('/countries', countries.countriesData);
app.get('/products', product.showProducts);

app.use((req, res, next) => {
  return res.status(404).json({ message: 'Endpoint not found' });
});

export default app;
