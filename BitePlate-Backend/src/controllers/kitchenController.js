// src/controllers/kitchenController.js
import pool from '../config/database.js';
import { PrepareOrderCommand, CancelOrderCommand, KitchenQueue } from '../patterns/CommandPattern.js';

const kitchenQueue = new KitchenQueue();

export const getKitchenQueue = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT kq.*, o.order_number, o.created_at,
                    array_agg(json_build_object('name', mi.name, 'quantity', oi.quantity)) as items
            FROM kitchen_queue kq
            JOIN orders o ON kq.order_id = o.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE kq.status IN ('PENDING', 'PREPARING')
            GROUP BY kq.id, o.id
            ORDER BY kq.priority DESC, kq.created_at ASC`
        );

        res.json({
            success: true,
            count: result.rows.length,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getOrderForKitchen = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await pool.query(
            `SELECT o.*, t.table_number,
                    json_agg(json_build_object(
                        'id', oi.id,
                        'name', mi.name,
                        'quantity', oi.quantity,
                        'special_requests', oi.special_requests
                    )) as items
            FROM orders o
            JOIN restaurant_tables t ON o.table_id = t.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.id = $1
            GROUP BY o.id, t.id`,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ['PREPARING', 'READY', 'COMPLETED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid status'
            });
        }

        const result = await pool.query(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [status, orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Update kitchen queue
        await pool.query(
            'UPDATE kitchen_queue SET status = $1 WHERE order_id = $2',
            [status === 'COMPLETED' ? 'COMPLETED' : status, orderId]
        );

        res.json({
            success: true,
            message: `Order marked as ${status}`,
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const reprioritizeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { priority } = req.body;

        if (priority === undefined || priority < 0 || priority > 10) {
            return res.status(400).json({
                success: false,
                error: 'Priority must be between 0 and 10'
            });
        }

        const result = await pool.query(
            `UPDATE kitchen_queue SET priority = $1, updated_at = NOW() WHERE order_id = $2 RETURNING *`,
            [priority, orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found in kitchen queue'
            });
        }

        res.json({
            success: true,
            message: 'Order reprioritized',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const completeOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await pool.query(
            `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            ['READY', orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        await pool.query(
            'UPDATE kitchen_queue SET status = $1 WHERE order_id = $2',
            ['READY', orderId]
        );

        res.json({
            success: true,
            message: 'Order marked as ready',
            data: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getKitchenStats = async (req, res) => {
    try {
        const stats = await pool.query(
            `SELECT 
                COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pending_orders,
                COUNT(CASE WHEN status = 'PREPARING' THEN 1 END) as preparing_orders,
                COUNT(CASE WHEN status = 'READY' THEN 1 END) as ready_orders,
                AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/60) as avg_prep_time_minutes
            FROM kitchen_queue`
        );

        res.json({
            success: true,
            data: stats.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    getKitchenQueue,
    getOrderForKitchen,
    updateOrderStatus,
    reprioritizeOrder,
    completeOrder,
    getKitchenStats
};