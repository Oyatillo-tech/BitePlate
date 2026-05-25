const express = require('express');
const tableController = require('../controllers/tableController');

const router = express.Router();

router.get('/', tableController.getAllTables);
router.get('/available', tableController.getAvailableTables);
router.put('/:tableId/seat', tableController.seatTable);
router.put('/:tableId/clear', tableController.clearTable);

module.exports = router;