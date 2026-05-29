// src/routes/analyticsRoutes.js
import express from 'express';
import analyticsController from '../controllers/analyticsController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', authMiddleware, analyticsController.getDashboardAnalytics);
router.get('/revenue', authMiddleware, analyticsController.getRevenueAnalytics);
router.get('/items', authMiddleware, analyticsController.getItemAnalytics);
router.get('/staff', authMiddleware, analyticsController.getStaffAnalytics);
router.get('/tables', authMiddleware, analyticsController.getTableAnalytics);
router.get('/peak-hours', authMiddleware, analyticsController.getPeakHoursAnalytics);
router.get('/payment-methods', authMiddleware, analyticsController.getPaymentMethodAnalytics);

export default router;