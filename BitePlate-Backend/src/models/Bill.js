// src/models/Bill.js
import pool from '../config/database.js';

class BillModel {
    static async create(orderId, pricingData) {
        try {
            const result = await pool.query(
                `INSERT INTO bills 
                (order_id, subtotal, tax, discount, total)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *`,
                [
                    orderId,
                    pricingData.subtotal,
                    pricingData.tax,
                    pricingData.discount || 0,
                    pricingData.total
                ]
            );

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error creating bill:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query(
                'SELECT * FROM bills WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching bill:', err);
            throw err;
        }
    }

    static async getByOrderId(orderId) {
        try {
            const result = await pool.query(
                'SELECT * FROM bills WHERE order_id = $1',
                [orderId]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching bill by order:', err);
            throw err;
        }
    }

    static async addTip(billId, tip) {
        try {
            const bill = await this.getById(billId);

            if (!bill) {
                throw new Error('Bill not found');
            }

            const finalTotal = bill.total + tip;

            const result = await pool.query(
                `UPDATE bills 
                SET tip = $1, final_total = $2 
                WHERE id = $3 
                RETURNING *`,
                [tip, finalTotal, billId]
            );

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error adding tip:', err);
            throw err;
        }
    }

    static async pay(billId, paymentMethod) {
        try {
            const result = await pool.query(
                `UPDATE bills 
                SET status = 'PAID', payment_method = $1 
                WHERE id = $2 
                RETURNING *`,
                [paymentMethod, billId]
            );

            if (result.rows.length > 0) {
                const bill = result.rows[0];

                // Update order status
                await pool.query(
                    'UPDATE orders SET status = $1 WHERE id = $2',
                    ['PAID', bill.order_id]
                );

                // Get order and clear table
                const orderResult = await pool.query(
                    'SELECT table_id FROM orders WHERE id = $1',
                    [bill.order_id]
                );

                if (orderResult.rows.length > 0) {
                    await pool.query(
                        'UPDATE restaurant_tables SET status = $1 WHERE id = $2',
                        ['CLEARED', orderResult.rows[0].table_id]
                    );
                }
            }

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error paying bill:', err);
            throw err;
        }
    }

    static async refund(billId) {
        try {
            const result = await pool.query(
                `UPDATE bills 
                SET status = 'REFUNDED' 
                WHERE id = $1 
                RETURNING *`,
                [billId]
            );

            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error refunding bill:', err);
            throw err;
        }
    }

    static async getBillsByDateRange(startDate, endDate) {
        try {
            const result = await pool.query(
                `SELECT * FROM bills 
                WHERE DATE(created_at) BETWEEN $1 AND $2
                ORDER BY created_at DESC`,
                [startDate, endDate]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching bills by date:', err);
            throw err;
        }
    }

    static async getTotalRevenue(days = null) {
        try {
            let query = 'SELECT SUM(final_total) as revenue FROM bills WHERE status = $1';
            const params = ['PAID'];

            if (days) {
                query += ` AND created_at >= NOW() - INTERVAL '${days} days'`;
            }

            const result = await pool.query(query, params);
            return result.rows[0].revenue || 0;
        } catch (err) {
            console.error('❌ Error calculating total revenue:', err);
            throw err;
        }
    }

    static async getRevenueByPaymentMethod(days = 30) {
        try {
            const result = await pool.query(
                `SELECT payment_method, COUNT(*) as count, SUM(final_total) as revenue 
                FROM bills 
                WHERE status = 'PAID' 
                AND created_at >= NOW() - INTERVAL '${days} days'
                GROUP BY payment_method`
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching revenue by payment method:', err);
            throw err;
        }
    }

    static async getPendingBills() {
        try {
            const result = await pool.query(
                'SELECT * FROM bills WHERE status = $1 ORDER BY created_at DESC',
                ['PENDING']
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching pending bills:', err);
            throw err;
        }
    }
}

export default BillModel;