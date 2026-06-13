// src/models/Order.js
import pool from '../config/database.js';

class OrderModel {
    static generateOrderNumber() {
        return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    }

    static async create(tableId, staffId, items) {
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            const orderNumber = this.generateOrderNumber();

            // Create order
            const orderResult = await client.query(
                `INSERT INTO orders (order_number, table_id, staff_id, status)
                VALUES ($1, $2, $3, 'CREATED')
                RETURNING *`,
                [orderNumber, tableId, staffId]
            );

            const orderId = orderResult.rows[0].id;

            // Add items to order
            let totalPrice = 0;
            for (const item of items) {
                const menuItem = await client.query(
                    'SELECT price FROM menu_items WHERE id = $1',
                    [item.menu_item_id]
                );

                if (menuItem.rows.length === 0) {
                    throw new Error(`Menu item ${item.menu_item_id} not found`);
                }

                const price = menuItem.rows[0].price;
                const quantity = item.quantity || 1;
                totalPrice += price * quantity;

                await client.query(
                    `INSERT INTO order_items 
                    (order_id, menu_item_id, quantity, item_price, special_requests)
                    VALUES ($1, $2, $3, $4, $5)`,
                    [orderId, item.menu_item_id, quantity, price, item.special_requests || null]
                );
            }

            // Update table status
            await client.query(
                'UPDATE restaurant_tables SET status = $1 WHERE id = $2',
                ['OCCUPIED', tableId]
            );

            // Add to kitchen queue
            await client.query(
                `INSERT INTO kitchen_queue (order_id, status, priority)
                VALUES ($1, 'PENDING', 0)`,
                [orderId]
            );

            // Calculate and update total
            const subtotal = totalPrice;
            const tax = subtotal * 0.2;
            const total = subtotal + tax;

            await client.query(
                `UPDATE orders 
                SET subtotal = $1, tax = $2, total = $3 
                WHERE id = $4`,
                [subtotal, tax, total, orderId]
            );

            await client.query('COMMIT');

            return await this.getById(orderId);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error('❌ Error creating order:', err);
            throw err;
        } finally {
            client.release();
        }
    }

    static async getById(id) {
        try {
            const orderResult = await pool.query(
                'SELECT * FROM orders WHERE id = $1',
                [id]
            );

            if (orderResult.rows.length === 0) return null;

            const order = orderResult.rows[0];

            const itemsResult = await pool.query(
                `SELECT oi.*, mi.name, mi.type, mi.vegan, mi.allergens
                FROM order_items oi
                JOIN menu_items mi ON oi.menu_item_id = mi.id
                WHERE oi.order_id = $1
                ORDER BY oi.created_at`,
                [id]
            );

            order.items = itemsResult.rows;
            return order;
        } catch (err) {
            console.error('❌ Error fetching order:', err);
            throw err;
        }
    }

    static async updateStatus(id, status) {
        try {
            const result = await pool.query(
                `UPDATE orders 
                SET status = $1, updated_at = NOW() 
                WHERE id = $2 
                RETURNING *`,
                [status, id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error updating order status:', err);
            throw err;
        }
    }

    static async getByTableId(tableId) {
        try {
            const result = await pool.query(
                `SELECT * FROM orders 
                WHERE table_id = $1 
                AND status NOT IN ('PAID', 'CANCELLED')
                ORDER BY created_at DESC`,
                [tableId]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching orders by table:', err);
            throw err;
        }
    }

    static async getByStaffId(staffId) {
        try {
            const result = await pool.query(
                `SELECT * FROM orders 
                WHERE staff_id = $1 
                ORDER BY created_at DESC`,
                [staffId]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching orders by staff:', err);
            throw err;
        }
    }

    static async getByStatus(status) {
        try {
            const result = await pool.query(
                `SELECT * FROM orders 
                WHERE status = $1 
                ORDER BY created_at DESC`,
                [status]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching orders by status:', err);
            throw err;
        }
    }

    static async getAllToday() {
        try {
            const result = await pool.query(
                `SELECT * FROM orders 
                WHERE DATE(created_at) = CURRENT_DATE
                ORDER BY created_at DESC`
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching today orders:', err);
            throw err;
        }
    }

    static async getOrdersByDateRange(startDate, endDate) {
        try {
            const result = await pool.query(
                `SELECT * FROM orders 
                WHERE DATE(created_at) BETWEEN $1 AND $2
                ORDER BY created_at DESC`,
                [startDate, endDate]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching orders by date range:', err);
            throw err;
        }
    }

    static async addItem(orderId, menuItemId, quantity, specialRequests) {
        try {
            const menuItem = await pool.query(
                'SELECT price FROM menu_items WHERE id = $1',
                [menuItemId]
            );

            if (menuItem.rows.length === 0) {
                throw new Error('Menu item not found');
            }

            const price = menuItem.rows[0].price;

            const result = await pool.query(
                `INSERT INTO order_items 
                (order_id, menu_item_id, quantity, item_price, special_requests)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [orderId, menuItemId, quantity, price, specialRequests]
            );

            // Recalculate order total
            await this.recalculateTotal(orderId);

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error adding item to order:', err);
            throw err;
        }
    }

    static async removeItem(orderItemId) {
        try {
            const itemResult = await pool.query(
                'SELECT order_id FROM order_items WHERE id = $1',
                [orderItemId]
            );

            if (itemResult.rows.length === 0) {
                throw new Error('Order item not found');
            }

            const orderId = itemResult.rows[0].order_id;

            await pool.query(
                'DELETE FROM order_items WHERE id = $1',
                [orderItemId]
            );

            // Recalculate order total
            await this.recalculateTotal(orderId);

            return true;
        } catch (err) {
            console.error('❌ Error removing item from order:', err);
            throw err;
        }
    }

    static async recalculateTotal(orderId) {
        try {
            const result = await pool.query(
                `SELECT SUM(item_price * quantity) as subtotal 
                FROM order_items WHERE order_id = $1`,
                [orderId]
            );

            const subtotal = result.rows[0].subtotal || 0;
            const tax = subtotal * 0.2;
            const total = subtotal + tax;

            await pool.query(
                `UPDATE orders 
                SET subtotal = $1, tax = $2, total = $3 
                WHERE id = $4`,
                [subtotal, tax, total, orderId]
            );

            return { subtotal, tax, total };
        } catch (err) {
            console.error('❌ Error recalculating order total:', err);
            throw err;
        }
    }

    static async cancel(id) {
        try {
            const order = await this.getById(id);

            if (!order) {
                throw new Error('Order not found');
            }

            // Update order status
            await this.updateStatus(id, 'CANCELLED');

            // Free up table
            await pool.query(
                'UPDATE restaurant_tables SET status = $1 WHERE id = $2',
                ['FREE', order.table_id]
            );

            // Update kitchen queue
            await pool.query(
                'UPDATE kitchen_queue SET status = $1 WHERE order_id = $2',
                ['CANCELLED', id]
            );

            return order;
        } catch (err) {
            console.error('❌ Error cancelling order:', err);
            throw err;
        }
    }

    static async applyDiscount(orderId, discountPercentage) {
        try {
            const order = await this.getById(orderId);

            if (!order) {
                throw new Error('Order not found');
            }

            const discount = order.subtotal * (discountPercentage / 100);
            const newSubtotal = order.subtotal - discount;
            const tax = newSubtotal * 0.2;
            const total = newSubtotal + tax;

            await pool.query(
                `UPDATE orders 
                SET discount_percentage = $1, subtotal = $2, tax = $3, total = $4 
                WHERE id = $5`,
                [discountPercentage, newSubtotal, tax, total, orderId]
            );

            return { subtotal: newSubtotal, tax, total, discount };
        } catch (err) {
            console.error('❌ Error applying discount:', err);
            throw err;
        }
    }
}

export default OrderModel;