// src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import billRoutes from './routes/billRoutes.js';
import kitchenRoutes from './routes/kitchenRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
    console.log(`📌 ${req.method} ${req.path}`);
    next();
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: '✅ Backend running' });
});

// API v1 Routes
const apiV1 = '/api/v1';

app.use(`${apiV1}/auth`, authRoutes);
app.use(`${apiV1}/menu`, menuRoutes);
app.use(`${apiV1}/orders`, orderRoutes);
app.use(`${apiV1}/tables`, tableRoutes);
app.use(`${apiV1}/bills`, billRoutes);
app.use(`${apiV1}/kitchen`, kitchenRoutes);
app.use(`${apiV1}/analytics`, analyticsRoutes);
app.use(`${apiV1}/reservations`, reservationRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error Handler
app.use(errorHandler);

export default app;