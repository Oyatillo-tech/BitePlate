// src/models/MenuItem.js
import pool from '../config/database.js';
import { MenuItemFactory } from '../patterns/FactoryPattern.js';

class MenuItemModel {
    static async getAllByType(type) {
        try {
            const result = await pool.query(
                'SELECT * FROM menu_items WHERE type = $1 AND available = TRUE ORDER BY name',
                [type]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching menu items:', err);
            throw err;
        }
    }

    static async getAll() {
        try {
            const result = await pool.query(
                'SELECT * FROM menu_items WHERE available = TRUE ORDER BY type, name'
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching all menu items:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM menu_items WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching menu item:', err);
            throw err;
        }
    }

    static async create(data) {
        try {
            const {
                name,
                type,
                description,
                price,
                prep_time,
                vegan,
                allergens,
                serving_size,
                alcoholic
            } = data;

            const result = await pool.query(
                `INSERT INTO menu_items 
                (name, type, description, price, prep_time, vegan, allergens, serving_size, alcoholic, available)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE)
                RETURNING *`,
                [name, type, description, price, prep_time, vegan, allergens, serving_size, alcoholic]
            );

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error creating menu item:', err);
            throw err;
        }
    }

    static async update(id, data) {
        try {
            const {
                name,
                description,
                price,
                available,
                prep_time,
                vegan,
                allergens
            } = data;

            const result = await pool.query(
                `UPDATE menu_items 
                SET name = COALESCE($1, name),
                    description = COALESCE($2, description),
                    price = COALESCE($3, price),
                    available = COALESCE($4, available),
                    prep_time = COALESCE($5, prep_time),
                    vegan = COALESCE($6, vegan),
                    allergens = COALESCE($7, allergens)
                WHERE id = $8
                RETURNING *`,
                [name, description, price, available, prep_time, vegan, allergens, id]
            );

            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error updating menu item:', err);
            throw err;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM menu_items WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rowCount > 0;
        } catch (err) {
            console.error('❌ Error deleting menu item:', err);
            throw err;
        }
    }

    static async toggleAvailability(id) {
        try {
            const result = await pool.query(
                `UPDATE menu_items 
                SET available = NOT available 
                WHERE id = $1 
                RETURNING *`,
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error toggling availability:', err);
            throw err;
        }
    }

    static async search(query) {
        try {
            const result = await pool.query(
                `SELECT * FROM menu_items 
                WHERE (name ILIKE $1 OR description ILIKE $1) 
                AND available = TRUE
                ORDER BY name`,
                [`%${query}%`]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error searching menu items:', err);
            throw err;
        }
    }

    static async getItemsByAllergen(allergen) {
        try {
            const result = await pool.query(
                `SELECT * FROM menu_items 
                WHERE allergens ILIKE $1 
                AND available = TRUE`,
                [`%${allergen}%`]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching items by allergen:', err);
            throw err;
        }
    }

    static async getVeganItems() {
        try {
            const result = await pool.query(
                'SELECT * FROM menu_items WHERE vegan = TRUE AND available = TRUE'
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching vegan items:', err);
            throw err;
        }
    }
}

export default MenuItemModel;