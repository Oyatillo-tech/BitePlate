const pool = require('../config/database');

class Table {
    static async getAll() {
        const result = await pool.query('SELECT * FROM restaurant_tables ORDER BY table_number');
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query('SELECT * FROM restaurant_tables WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            `UPDATE restaurant_tables SET status = $1 WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    static async seat(id, partySize) {
        const result = await pool.query(
            `UPDATE restaurant_tables SET status = 'OCCUPIED' WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }

    static async clear(id) {
        const result = await pool.query(
            `UPDATE restaurant_tables SET status = 'FREE' WHERE id = $1 RETURNING *`,
            [id]
        );
        return result.rows[0];
    }

    static async getAvailableTables(partySize) {
        const result = await pool.query(
            `SELECT * FROM restaurant_tables 
             WHERE status = 'FREE' AND capacity >= $1
             ORDER BY capacity`,
            [partySize]
        );
        return result.rows;
    }
}

module.exports = Table;