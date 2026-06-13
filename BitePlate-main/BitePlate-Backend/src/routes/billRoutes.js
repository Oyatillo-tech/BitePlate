// src/routes/billRoutes.js
import express from 'express';
import billController from '../controllers/billController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, billController.getPendingBills);
router.get('/range/date', authMiddleware, billController.getBillsByDateRange);
router.get('/revenue/total', authMiddleware, billController.getTotalRevenue);
router.get('/revenue/method', authMiddleware, billController.getRevenueByPaymentMethod);
router.get('/order/:orderId', authMiddleware, billController.getBillByOrder);
router.post('/:orderId/generate', authMiddleware, billController.generateBill);
router.post('/:billId/split', authMiddleware, billController.splitBill);
router.put('/:billId/tip', authMiddleware, billController.addTip);
router.put('/:billId/pay', authMiddleware, billController.payBill);
router.put('/:billId/refund', authMiddleware, billController.refundBill);
router.put('/splits/:splitId/pay', authMiddleware, billController.paySplit);
router.get('/:billId', authMiddleware, billController.getBill);

export default router;
