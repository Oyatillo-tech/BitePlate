const pool = require('../config/database');

class OrderHistoryLog {
    static instance = null;

    constructor() {
        if (OrderHistoryLog.instance) {
            throw new Error("OrderHistoryLog is a Singleton");
        }
        OrderHistoryLog.instance = this;
    }

    static getInstance() {
        if (!OrderHistoryLog.instance) {
            new OrderHistoryLog();
        }
        return OrderHistoryLog.instance;
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
            console.error('Error logging order:', err);
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

    async getMostOrderedItems(limit = 10) {
        const query = `
            SELECT jsonb_array_elements(items)->>'name' as item_name, 
                   COUNT(*) as count
            FROM order_history_log
            GROUP BY item_name
            ORDER BY count DESC
            LIMIT $1
        `;
        const result = await pool.query(query, [limit]);
        return result.rows;
    }

    async getAnalytics() {
        const totalRevenue = await pool.query(
            'SELECT SUM(total) as revenue FROM order_history_log'
        );

        const topItems = await this.getMostOrderedItems(10);

        const peakHours = await pool.query(`
            SELECT EXTRACT(HOUR FROM timestamp) as hour, COUNT(*) as count
            FROM order_history_log
            GROUP BY hour
            ORDER BY count DESC
        `);

        return {
            totalRevenue: totalRevenue.rows[0].revenue,
            topItems,
            peakHours: peakHours.rows
        };
    }
}

module.exports = OrderHistoryLog;