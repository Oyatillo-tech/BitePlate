const Order = require('../models/Order');
const Table = require('../models/Table');
const OrderHistoryLog = require('../patterns/SingletonPattern');
const { PrepareOrderCommand, CancelOrderCommand } = require('../patterns/CommandPattern');

exports.createOrder = async (req, res) => {
    try {
        const { tableId, staffId, items } = req.body;

        // Validate
        if (!tableId || !staffId || !items || items.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create order
        const order = await Order.create(tableId, staffId, items);

        // Calculate total
        await Order.calculateTotal(order.id);

        // Update table status
        await Table.updateStatus(tableId, 'OCCUPIED');

        res.status(201).json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.updateStatus(orderId, 'CONFIRMED');

        // Log to history (Singleton)
        const historyLog = OrderHistoryLog.getInstance();
        await historyLog.logOrder(order);

        // Send to kitchen (Command Pattern)
        const prepareCmd = new PrepareOrderCommand(orderId);
        await prepareCmd.execute();

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.getById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const cancelCmd = new CancelOrderCommand(orderId);
        await cancelCmd.execute();

        const order = await Order.updateStatus(orderId, 'CANCELLED');

        res.json({ success: true, data: order });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const historyLog = OrderHistoryLog.getInstance();
        const analytics = await historyLog.getAnalytics();

        res.json({ success: true, data: analytics });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};