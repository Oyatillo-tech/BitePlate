// src/routes/billRoutes.js
import express from 'express';
import billController from '../controllers/billController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:orderId/generate', authMiddleware, billController.generateBill);
router.get('/order/:orderId', authMiddleware, billController.getBillByOrder);
router.get('/:billId', authMiddleware, billController.getBill);
router.get('/', authMiddleware, billController.getPendingBills);
router.put('/:billId/tip', authMiddleware, billController.addTip);
router.put('/:billId/pay', authMiddleware, billController.payBill);
router.put('/:billId/refund', authMiddleware, billController.refundBill);
router.get('/range/date', authMiddleware, billController.getBillsByDateRange);
router.get('/revenue/total', authMiddleware, billController.getTotalRevenue);
router.get('/revenue/method', authMiddleware, billController.getRevenueByPaymentMethod);

export default router;