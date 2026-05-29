// src/models/Table.js
import pool from '../config/database.js';

class TableModel {
    static async getAll() {
        try {
            const result = await pool.query(
                'SELECT * FROM restaurant_tables ORDER BY table_number'
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching tables:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM restaurant_tables WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching table:', err);
            throw err;
        }
    }

    static async getByTableNumber(tableNumber) {
        try {
            const result = await pool.query(
                'SELECT * FROM restaurant_tables WHERE table_number = $1',
                [tableNumber]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching table by number:', err);
            throw err;
        }
    }

    static async updateStatus(id, status) {
        try {
            const result = await pool.query(
                `UPDATE restaurant_tables SET status = $1 WHERE id = $2 RETURNING *`,
                [status, id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error updating table status:', err);
            throw err;
        }
    }

    static async seat(id) {
        try {
            return await this.updateStatus(id, 'OCCUPIED');
        } catch (err) {
            console.error('❌ Error seating table:', err);
            throw err;
        }
    }

    static async clear(id) {
        try {
            return await this.updateStatus(id, 'FREE');
        } catch (err) {
            console.error('❌ Error clearing table:', err);
            throw err;
        }
    }

    static async reserve(id) {
        try {
            return await this.updateStatus(id, 'RESERVED');
        } catch (err) {
            console.error('❌ Error reserving table:', err);
            throw err;
        }
    }

    static async awaitBill(id) {
        try {
            return await this.updateStatus(id, 'AWAITING_BILL');
        } catch (err) {
            console.error('❌ Error setting table to awaiting bill:', err);
            throw err;
        }
    }

    static async getAvailableTables(partySize) {
        try {
            const result = await pool.query(
                `SELECT * FROM restaurant_tables 
                WHERE status = 'FREE' AND capacity >= $1
                ORDER BY capacity ASC`,
                [partySize]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching available tables:', err);
            throw err;
        }
    }

    static async getTableStatus() {
        try {
            const result = await pool.query(
                `SELECT status, COUNT(*) as count 
                FROM restaurant_tables 
                GROUP BY status`
            );

            const status = {};
            result.rows.forEach(row => {
                status[row.status] = row.count;
            });

            return status;
        } catch (err) {
            console.error('❌ Error fetching table status:', err);
            throw err;
        }
    }

    static async create(tableNumber, capacity) {
        try {
            const result = await pool.query(
                `INSERT INTO restaurant_tables (table_number, capacity)
                VALUES ($1, $2)
                RETURNING *`,
                [tableNumber, capacity]
            );
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error creating table:', err);
            throw err;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM restaurant_tables WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rowCount > 0;
        } catch (err) {
            console.error('❌ Error deleting table:', err);
            throw err;
        }
    }

    static async getOccupiedTables() {
        try {
            const result = await pool.query(
                'SELECT * FROM restaurant_tables WHERE status = $1 ORDER BY table_number',
                ['OCCUPIED']
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching occupied tables:', err);
            throw err;
        }
    }

    static async getFreeTables() {
        try {
            const result = await pool.query(
                'SELECT * FROM restaurant_tables WHERE status = $1 ORDER BY table_number',
                ['FREE']
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching free tables:', err);
            throw err;
        }
    }
}

export default TableModel;