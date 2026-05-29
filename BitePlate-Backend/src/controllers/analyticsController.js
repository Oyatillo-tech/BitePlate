// src/controllers/analyticsController.js
import OrderHistoryLog from '../patterns/SingletonPattern.js';
import pool from '../config/database.js';

export const getDashboardAnalytics = async (req, res) => {
    try {
        const historyLog = OrderHistoryLog.getInstance();
        const analytics = await historyLog.getAnalytics();

        res.json({
            success: true,
            data: analytics
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getRevenueAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const revenue = await pool.query(
            `SELECT 
                DATE(created_at) as date,
                COUNT(*) as order_count,
                SUM(final_total) as daily_revenue
            FROM bills
            WHERE status = 'PAID'
            AND created_at >= NOW() - INTERVAL '${parseInt(days)} days'
            GROUP BY DATE(created_at)
            ORDER BY date DESC`
        );

        res.json({
            success: true,
            data: revenue.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getItemAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const historyLog = OrderHistoryLog.getInstance();
        const topItems = await historyLog.getMostOrderedItems(20);

        res.json({
            success: true,
            data: topItems
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getStaffAnalytics = async (req, res) => {
    try {
        const { days = 30 } = req.query;

        const result = await pool.query(
            `SELECT 
                s.id,
                s.name,
                COUNT(o.id) as orders_served,
                SUM(o.total) as total_revenue,
                AVG(o.total) as avg_order_value
            FROM staff s
            LEFT JOIN orders o ON s.id = o.staff_id
            WHERE o.created_at >= NOW() - INTERVAL '${parseInt(days)} days'
            GROUP BY s.id, s.name
            ORDER BY orders_served DESC`
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getTableAnalytics = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                t.id,
                t.table_number,
                COUNT(o.id) as orders_served,
                SUM(o.total) as total_revenue,
                AVG(o.total) as avg_order_value
            FROM restaurant_tables t
            LEFT JOIN orders o ON t.id = o.table_id
            GROUP BY t.id, t.table_number
            ORDER BY orders_served DESC`
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getPeakHoursAnalytics = async (req, res) => {
    try {
        const historyLog = OrderHistoryLog.getInstance();
        const peakHours = await historyLog.getPeakHours();

        res.json({
            success: true,
            data: peakHours
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getPaymentMethodAnalytics = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                payment_method,
                COUNT(*) as transaction_count,
                SUM(final_total) as total_revenue,
                AVG(final_total) as avg_transaction
            FROM bills
            WHERE status = 'PAID'
            GROUP BY payment_method`
        );

        res.json({
            success: true,
            data: result.rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    getDashboardAnalytics,
    getRevenueAnalytics,
    getItemAnalytics,
    getStaffAnalytics,
    getTableAnalytics,
    getPeakHoursAnalytics,
    getPaymentMethodAnalytics
};