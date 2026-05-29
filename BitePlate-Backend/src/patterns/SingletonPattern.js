// src/patterns/SingletonPattern.js
import pool from '../config/database.js';

class OrderHistoryLog {
    static #instance = null;

    constructor() {
        if (OrderHistoryLog.#instance !== null) {
            throw new Error('OrderHistoryLog is a Singleton. Use getInstance()');
        }
    }

    static getInstance() {
        if (OrderHistoryLog.#instance === null) {
            OrderHistoryLog.#instance = new OrderHistoryLog();
        }
        return OrderHistoryLog.#instance;
    }

    async logOrder(orderData) {
        const query = `
            INSERT INTO order_history_log 
            (order_id, order_number, table_number, staff_id, items, total, timestamp)
            VALUES ($1, $2, $3, $4, $5, $6, NOW())
            RETURNING *
        `;

        try {
            const result = await pool.query(query, [
                orderData.id,
                orderData.order_number,
                orderData.table_id,
                orderData.staff_id,
                JSON.stringify(orderData.items),
                orderData.total
            ]);
            console.log('✓ Order logged to history');
            return result.rows[0];
        } catch (err) {
            console.error('❌ Error logging order:', err);
            throw err;
        }
    }

    async getOrdersByDate(date) {
        const query = `
            SELECT * FROM order_history_log 
            WHERE DATE(timestamp) = $1
            ORDER BY timestamp DESC
        `;
        const result = await pool.query(query, [date]);
        return result.rows;
    }

    async getOrdersByTable(tableNumber) {
        const query = `
            SELECT * FROM order_history_log 
            WHERE table_number = $1
            ORDER BY timestamp DESC
        `;
        const result = await pool.query(query, [tableNumber]);
        return result.rows;
    }

    async getOrdersByDateRange(startDate, endDate) {
        const query = `
            SELECT * FROM order_history_log 
            WHERE DATE(timestamp) BETWEEN $1 AND $2
            ORDER BY timestamp DESC
        `;
        const result = await pool.query(query, [startDate, endDate]);
        return result.rows;
    }

    async getMostOrderedItems(limit = 10) {
        const query = `
            SELECT jsonb_array_elements(items)->>'name' as item_name, 
                   COUNT(*) as count,
                   SUM((jsonb_array_elements(items)->>'price')::numeric) as total_revenue
            FROM order_history_log
            WHERE items IS NOT NULL
            GROUP BY item_name
            ORDER BY count DESC
            LIMIT $1
        `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }

    async getTotalRevenue() {
        const query = 'SELECT SUM(total) as total_revenue FROM order_history_log';
        const result = await pool.query(query);
        return result.rows[0];
    }

    async getAverageOrderValue() {
        const query = `
            SELECT AVG(total) as avg_value, 
                   COUNT(*) as total_orders
            FROM order_history_log
        `;
        const result = await pool.query(query);
        return result.rows[0];
    }

    async getPeakHours() {
        const query = `
            SELECT EXTRACT(HOUR FROM timestamp) as hour, 
                   COUNT(*) as order_count,
                   SUM(total) as revenue
            FROM order_history_log
            GROUP BY EXTRACT(HOUR FROM timestamp)
            ORDER BY hour
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async getAnalytics(days = 30) {
        const totalRevenue = await this.getTotalRevenue();
        const averageOrderValue = await this.getAverageOrderValue();
        const topItems = await this.getMostOrderedItems(10);
        const peakHours = await this.getPeakHours();

        return {
            totalRevenue: totalRevenue.total_revenue,
            averageOrderValue: averageOrderValue.avg_value,
            totalOrders: averageOrderValue.total_orders,
            topItems,
            peakHours
        };
    }

    async getOrdersByStaff(staffId, days = 30) {
        const query = `
            SELECT COUNT(*) as total_orders, 
                   SUM(total) as total_revenue
            FROM order_history_log
            WHERE staff_id = $1 
            AND timestamp >= NOW() - INTERVAL '${days} days'
        `;
        const result = await pool.query(query, [staffId]);
        return result.rows[0];
    }

    async deleteOldRecords(days = 90) {
        const query = `
            DELETE FROM order_history_log
            WHERE timestamp < NOW() - INTERVAL '${days} days'
        `;
        const result = await pool.query(query);
        return result.rowCount;
    }
}

export default OrderHistoryLog;