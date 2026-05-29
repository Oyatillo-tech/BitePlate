// src/routes/kitchenRoutes.js
import express from 'express';
import kitchenController from '../controllers/kitchenController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/queue', authMiddleware, kitchenController.getKitchenQueue);
router.get('/stats', authMiddleware, kitchenController.getKitchenStats);
router.get('/:orderId', authMiddleware, kitchenController.getOrderForKitchen);
router.put('/:orderId/status', authMiddleware, requireRole(['CHEF', 'MANAGER']), kitchenController.updateOrderStatus);
router.put('/:orderId/priority', authMiddleware, requireRole(['CHEF', 'MANAGER']), kitchenController.reprioritizeOrder);
router.put('/:orderId/complete', authMiddleware, requireRole(['CHEF', 'MANAGER']), kitchenController.completeOrder);

export default router;