const express = require('express');
const billController = require('../controllers/billController');

const router = express.Router();

router.post('/:orderId/generate', billController.generateBill);
router.put('/:billId/tip', billController.addTip);
router.put('/:billId/pay/:paymentMethod', billController.payBill);

module.exports = router;