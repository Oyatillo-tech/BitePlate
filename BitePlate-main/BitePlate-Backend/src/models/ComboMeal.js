// src/models/ComboMeal.js
import pool from '../config/database.js';

class ComboMealModel {
    static async getAll() {
        try {
            const result = await pool.query(
                `SELECT mi.*,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ci.menu_item_id,
                                'name', item.name,
                                'quantity', ci.quantity,
                                'price', item.price,
                                'type', item.type
                            )
                        ) FILTER (WHERE ci.id IS NOT NULL),
                        '[]'
                    ) AS items
                FROM menu_items mi
                LEFT JOIN combo_items ci ON mi.id = ci.combo_id
                LEFT JOIN menu_items item ON ci.menu_item_id = item.id
                WHERE mi.type = 'COMBO' AND mi.available = TRUE
                GROUP BY mi.id
                ORDER BY mi.name`
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching combo meals:', err);
            throw err;
        }
    }

    static async getById(comboId) {
        try {
            const result = await pool.query(
                `SELECT mi.*,
                    COALESCE(
                        json_agg(
                            json_build_object(
                                'id', ci.menu_item_id,
                                'name', item.name,
                                'quantity', ci.quantity,
                                'price', item.price,
                                'type', item.type
                            )
                        ) FILTER (WHERE ci.id IS NOT NULL),
                        '[]'
                    ) AS items
                FROM menu_items mi
                LEFT JOIN combo_items ci ON mi.id = ci.combo_id
                LEFT JOIN menu_items item ON ci.menu_item_id = item.id
                WHERE mi.id = $1 AND mi.type = 'COMBO'
                GROUP BY mi.id`,
                [comboId]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching combo meal:', err);
            throw err;
        }
    }

    static async create(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const { name, description, price, items } = data;

            const comboResult = await client.query(
                `INSERT INTO menu_items (name, type, description, price, available)
                 VALUES ($1, 'COMBO', $2, $3, TRUE)
                 RETURNING *`,
                [name, description, price]
            );

            const combo = comboResult.rows[0];

            for (const item of items) {
                await client.query(
                    `INSERT INTO combo_items (combo_id, menu_item_id, quantity)
                     VALUES ($1, $2, $3)`,
                    [combo.id, item.menu_item_id, item.quantity || 1]
                );
            }

            await client.query('COMMIT');
            return await this.getById(combo.id);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('❌ Error creating combo meal:', err);
            throw err;
        } finally {
            client.release();
        }
    }
}

export default ComboMealModel;
