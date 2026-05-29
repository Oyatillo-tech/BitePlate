// src/controllers/orderController.js
import OrderModel from '../models/Order.js';
import TableModel from '../models/Table.js';
import OrderHistoryLog from '../patterns/SingletonPattern.js';
import { PrepareOrderCommand, CancelOrderCommand, CompleteOrderCommand, KitchenQueue } from '../patterns/CommandPattern.js';
import { getPricingStrategy } from '../patterns/StrategyPattern.js';

const kitchenQueue = new KitchenQueue();

export const createOrder = async (req, res) => {
    try {
        const { tableId, staffId, items } = req.body;

        if (!tableId || !staffId || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Validate table exists
        const table = await TableModel.getById(tableId);
        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        // Create order
        const order = await OrderModel.create(tableId, staffId, items);

        // Send to kitchen queue
        const prepareCmd = new PrepareOrderCommand(order.id);
        kitchenQueue.enqueue(prepareCmd);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: order
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export const confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await OrderModel.updateStatus(orderId, 'CONFIRMED');

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Log to history (Singleton Pattern)
        const historyLog = OrderHistoryLog.getInstance();
        await historyLog.logOrder(order);

        // Execute prepare command
        const prepareCmd = new PrepareOrderCommand(orderId);
        await prepareCmd.execute();

        res.json({
            success: true,
            message: 'Order confirmed and sent to kitchen',
            data: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await OrderModel.getById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        res.json({
            success: true,
            data: order
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

        const order = await OrderModel.getById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Execute complete command
        const completeCmd = new CompleteOrderCommand(orderId);
        await completeCmd.execute();

        const updatedOrder = await OrderModel.updateStatus(orderId, 'READY');

        res.json({
            success: true,
            message: 'Order marked as ready',
            data: updatedOrder
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Execute cancel command
        const cancelCmd = new CancelOrderCommand(orderId);
        await cancelCmd.execute();

        const order = await OrderModel.cancel(orderId);

        res.json({
            success: true,
            message: 'Order cancelled',
            data: order
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const addItemToOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { menuItemId, quantity, specialRequests } = req.body;

        const item = await OrderModel.addItem(orderId, menuItemId, quantity, specialRequests);

        res.json({
            success: true,
            message: 'Item added to order',
            data: item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const removeItemFromOrder = async (req, res) => {
    try {
        const { itemId } = req.params;

        const removed = await OrderModel.removeItem(itemId);

        if (!removed) {
            return res.status(404).json({
                success: false,
                error: 'Order item not found'
            });
        }

        res.json({
            success: true,
            message: 'Item removed from order'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const applyDiscount = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { discountPercentage } = req.body;

        if (!discountPercentage || discountPercentage < 0 || discountPercentage > 100) {
            return res.status(400).json({
                success: false,
                error: 'Invalid discount percentage'
            });
        }

        const result = await OrderModel.applyDiscount(orderId, discountPercentage);

        res.json({
            success: true,
            message: 'Discount applied',
            data: result
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getOrderHistory = async (req, res) => {
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

export const getOrdersByTable = async (req, res) => {
    try {
        const { tableId } = req.params;

        const orders = await OrderModel.getByTableId(tableId);

        res.json({
            success: true,
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getOrdersByStaff = async (req, res) => {
    try {
        const { staffId } = req.params;

        const orders = await OrderModel.getByStaffId(staffId);

        res.json({
            success: true,
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getTodayOrders = async (req, res) => {
    try {
        const orders = await OrderModel.getAllToday();

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    createOrder,
    confirmOrder,
    getOrder,
    completeOrder,
    cancelOrder,
    addItemToOrder,
    removeItemFromOrder,
    applyDiscount,
    getOrderHistory,
    getOrdersByTable,
    getOrdersByStaff,
    getTodayOrders
};