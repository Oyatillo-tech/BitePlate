// src/routes/orderRoutes.js
import express from 'express';
import orderController from '../controllers/orderController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/today', authMiddleware, orderController.getTodayOrders);
router.get('/history', authMiddleware, orderController.getOrderHistory);
router.get('/:orderId', authMiddleware, orderController.getOrder);
router.put('/:orderId/confirm', authMiddleware, orderController.confirmOrder);
router.put('/:orderId/complete', authMiddleware, orderController.completeOrder);
router.put('/:orderId/cancel', authMiddleware, orderController.cancelOrder);
router.post('/:orderId/item', authMiddleware, orderController.addItemToOrder);
router.delete('/:orderId/item/:itemId', authMiddleware, orderController.removeItemFromOrder);
router.put('/:orderId/discount', authMiddleware, orderController.applyDiscount);
router.get('/table/:tableId', authMiddleware, orderController.getOrdersByTable);
router.get('/staff/:staffId', authMiddleware, orderController.getOrdersByStaff);

export default router;