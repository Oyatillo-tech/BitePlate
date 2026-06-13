// src/routes/tableRoutes.js
import express from 'express';
import tableController from '../controllers/tableController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', tableController.getAllTables);
router.get('/status', tableController.getTableStatus);
router.get('/available', tableController.getAvailableTables);
router.get('/occupied', tableController.getOccupiedTables);
router.get('/free', tableController.getFreeTables);
router.get('/:id', tableController.getTable);

router.post('/', authMiddleware, tableController.createTable);
router.put('/:id/seat', authMiddleware, tableController.seatTable);
router.put('/:id/clear', authMiddleware, tableController.clearTable);
router.put('/:id/reserve', authMiddleware, tableController.reserveTable);
router.put('/:id/bill', authMiddleware, tableController.tableAwaitingBill);
router.delete('/:id', authMiddleware, tableController.deleteTable);

export default router;