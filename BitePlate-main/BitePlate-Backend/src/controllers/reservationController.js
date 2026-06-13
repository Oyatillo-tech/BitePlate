// src/controllers/reservationController.js
import ReservationModel from '../models/Reservation.js';
import TableModel from '../models/Table.js';

export const createReservation = async (req, res) => {
    try {
        const {
            tableId,
            customerName,
            customerPhone,
            customerEmail,
            reservationTime,
            partySize,
            specialRequests
        } = req.body;

        if (!tableId || !customerName || !reservationTime || !partySize) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Check if table exists
        const table = await TableModel.getById(tableId);
        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        // Create reservation
        const reservation = await ReservationModel.create({
            tableId,
            customerName,
            customerPhone,
            customerEmail,
            reservationTime,
            partySize,
            specialRequests
        });

        // Update table to reserved if not occupied
        if (table.status === 'FREE') {
            await TableModel.reserve(tableId);
        }

        res.status(201).json({
            success: true,
            message: 'Reservation created',
            data: reservation
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export const getReservation = async (req, res) => {
    try {
        const { id } = req.params;
        const reservation = await ReservationModel.getById(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'Reservation not found'
            });
        }

        res.json({
            success: true,
            data: reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getReservationsByDate = async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                success: false,
                error: 'Date parameter required'
            });
        }

        const reservations = await ReservationModel.getReservationsByDate(date);

        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getUpcomingReservations = async (req, res) => {
    try {
        const { hours = 2 } = req.query;

        const reservations = await ReservationModel.getUpcomingReservations(parseInt(hours));

        res.json({
            success: true,
            count: reservations.length,
            data: reservations
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await ReservationModel.cancel(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'Reservation not found'
            });
        }

        // Free up table if not occupied
        const table = await TableModel.getById(reservation.table_id);
        if (table && table.status === 'RESERVED') {
            await TableModel.clear(reservation.table_id);
        }

        res.json({
            success: true,
            message: 'Reservation cancelled',
            data: reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const completeReservation = async (req, res) => {
    try {
        const { id } = req.params;

        const reservation = await ReservationModel.complete(id);

        if (!reservation) {
            return res.status(404).json({
                success: false,
                error: 'Reservation not found'
            });
        }

        res.json({
            success: true,
            message: 'Reservation completed',
            data: reservation
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    createReservation,
    getReservation,
    getReservationsByDate,
    getUpcomingReservations,
    cancelReservation,
    completeReservation
};