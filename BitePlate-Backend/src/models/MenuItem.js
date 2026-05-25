const pool = require('../config/database');

class MenuItem {
    static async getAllByType(type) {
        const result = await pool.query(
            'SELECT * FROM menu_items WHERE type = $1 AND available = TRUE',
            [type]
        );
        return result.rows;
    }

    static async getAll() {
        const result = await pool.query('SELECT * FROM menu_items WHERE available = TRUE');
        return result.rows;
    }

    static async getById(id) {
        const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
        return result.rows[0] || null;
    }

    static async create(data) {
        const { name, type, description, price, prep_time, vegan, allergens } = data;
        const result = await pool.query(
            `INSERT INTO menu_items (name, type, description, price, prep_time, vegan, allergens)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING *`,
            [name, type, description, price, prep_time, vegan, allergens]
        );
        return result.rows[0];
    }

    static async update(id, data) {
        const { name, description, price, available } = data;
        const result = await pool.query(
            `UPDATE menu_items 
             SET name = $1, description = $2, price = $3, available = $4
             WHERE id = $5
             RETURNING *`,
            [name, description, price, available, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        await pool.query('DELETE FROM menu_items WHERE id = $1', [id]);
    }
}

module.exports = MenuItem;