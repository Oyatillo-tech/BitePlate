const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', orderController.createOrder);
router.get('/:orderId', orderController.getOrder);
router.put('/:orderId/confirm', orderController.confirmOrder);
router.put('/:orderId/cancel', orderController.cancelOrder);
router.get('/history/analytics', orderController.getOrderHistory);

module.exports = router;