const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Order {
    static async create(tableId, staffId, items) {
        const orderNumber = `ORD-${Date.now()}`;

        const result = await pool.query(
            `INSERT INTO orders (order_number, table_id, staff_id, status)
             VALUES ($1, $2, $3, 'CREATED')
             RETURNING *`,
            [orderNumber, tableId, staffId]
        );

        const orderId = result.rows[0].id;

        // Add items to order
        for (const item of items) {
            await pool.query(
                `INSERT INTO order_items (order_id, menu_item_id, quantity, item_price)
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.menu_item_id, item.quantity || 1, item.price]
            );
        }

        // Add to kitchen queue
        await pool.query(
            `INSERT INTO kitchen_queue (order_id, status, priority)
             VALUES ($1, 'PENDING', 0)`,
            [orderId]
        );

        return this.getById(orderId);
    }

    static async getById(id) {
        const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (orderResult.rows.length === 0) return null;

        const order = orderResult.rows[0];

        const itemsResult = await pool.query(
            `SELECT oi.*, mi.name, mi.type 
             FROM order_items oi
             JOIN menu_items mi ON oi.menu_item_id = mi.id
             WHERE oi.order_id = $1`,
            [id]
        );

        order.items = itemsResult.rows;
        return order;
    }

    static async updateStatus(id, status) {
        const result = await pool.query(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return result.rows[0];
    }

    static async getByTableId(tableId) {
        const result = await pool.query(
            `SELECT * FROM orders 
             WHERE table_id = $1 AND status NOT IN ('PAID', 'CANCELLED')
             ORDER BY created_at DESC`,
            [tableId]
        );
        return result.rows;
    }

    static async calculateTotal(orderId) {
        const itemsResult = await pool.query(
            'SELECT SUM(item_price * quantity) as subtotal FROM order_items WHERE order_id = $1',
            [orderId]
        );

        const subtotal = itemsResult.rows[0].subtotal || 0;
        const tax = subtotal * 0.2;
        const total = subtotal + tax;

        await pool.query(
            `UPDATE orders SET subtotal = $1, tax = $2, total = $3 WHERE id = $4`,
            [subtotal, tax, total, orderId]
        );

        return { subtotal, tax, total };
    }

    static async getAllTodayOrderCount() {
        const result = await pool.query(
            `SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE`
        );
        return result.rows[0].count;
    }
}

module.exports = Order;