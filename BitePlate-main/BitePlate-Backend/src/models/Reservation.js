// src/models/Reservation.js
import pool from '../config/database.js';

class ReservationModel {
    static async create(data) {
        try {
            const {
                tableId,
                customerName,
                customerPhone,
                customerEmail,
                reservationTime,
                partySize,
                specialRequests
            } = data;

            const result = await pool.query(
                `INSERT INTO reservations 
                (table_id, customer_name, customer_phone, customer_email, reservation_time, party_size, special_requests, status)
                VALUES ($1, $2, $3, $4, $5, $6, $7, 'CONFIRMED')
                RETURNING *`,
                [tableId, customerName, customerPhone, customerEmail, reservationTime, partySize, specialRequests]
            );

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error creating reservation:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM reservations WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching reservation:', err);
            throw err;
        }
    }

    static async getByTableId(tableId) {
        try {
            const result = await pool.query(
                `SELECT * FROM reservations 
                WHERE table_id = $1 
                AND status = 'CONFIRMED'
                ORDER BY reservation_time DESC`,
                [tableId]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching reservations by table:', err);
            throw err;
        }
    }

    static async getReservationsByDate(date) {
        try {
            const result = await pool.query(
                `SELECT r.*, t.table_number 
                FROM reservations r
                JOIN restaurant_tables t ON r.table_id = t.id
                WHERE DATE(r.reservation_time) = $1 
                AND r.status = 'CONFIRMED'
                ORDER BY r.reservation_time`,
                [date]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching reservations by date:', err);
            throw err;
        }
    }

    static async updateStatus(id, status) {
        try {
            const result = await pool.query(
                `UPDATE reservations 
                SET status = $1 
                WHERE id = $2 
                RETURNING *`,
                [status, id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error updating reservation status:', err);
            throw err;
        }
    }

    static async cancel(id) {
        try {
            return await this.updateStatus(id, 'CANCELLED');
        } catch (err) {
            console.error('❌ Error cancelling reservation:', err);
            throw err;
        }
    }

    static async complete(id) {
        try {
            return await this.updateStatus(id, 'COMPLETED');
        } catch (err) {
            console.error('❌ Error completing reservation:', err);
            throw err;
        }
    }

    static async getUpcomingReservations(hours = 2) {
        try {
            const result = await pool.query(
                `SELECT r.*, t.table_number 
                FROM reservations r
                JOIN restaurant_tables t ON r.table_id = t.id
                WHERE r.status = 'CONFIRMED'
                AND r.reservation_time BETWEEN NOW() AND NOW() + INTERVAL '${hours} hours'
                ORDER BY r.reservation_time`
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching upcoming reservations:', err);
            throw err;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM reservations WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rowCount > 0;
        } catch (err) {
            console.error('❌ Error deleting reservation:', err);
            throw err;
        }
    }
}

export default ReservationModel;