// src/routes/reservationRoutes.js
import express from 'express';
import reservationController from '../controllers/reservationController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, reservationController.createReservation);
router.get('/:id', authMiddleware, reservationController.getReservation);
router.get('/date/search', authMiddleware, reservationController.getReservationsByDate);
router.get('/upcoming/list', authMiddleware, reservationController.getUpcomingReservations);
router.put('/:id/cancel', authMiddleware, reservationController.cancelReservation);
router.put('/:id/complete', authMiddleware, reservationController.completeReservation);

export default router;