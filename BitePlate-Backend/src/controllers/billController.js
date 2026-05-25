const pool = require('../config/database');
const Order = require('../models/Order');
const {
    StandardPricing,
    HappyHourPricing,
    LoyaltyCardPricing,
    WeekendSurchargePricing,
    GroupDiscountPricing
} = require('../patterns/StrategyPattern');

exports.generateBill = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { discountStrategy = 'STANDARD', partySize = 1 } = req.body;

        // Get order
        const order = await Order.getById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Calculate subtotal
        const subtotal = order.items.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);

        // Select pricing strategy
        let strategy;
        switch (discountStrategy) {
            case 'HAPPY_HOUR':
                strategy = new HappyHourPricing();
                break;
            case 'LOYALTY_CARD':
                strategy = new LoyaltyCardPricing();
                break;
            case 'WEEKEND':
                strategy = new WeekendSurchargePricing();
                break;
            case 'GROUP':
                strategy = new GroupDiscountPricing(partySize);
                break;
            default:
                strategy = new StandardPricing();
        }

        const pricing = strategy.calculateTotal(subtotal);

        // Create bill
        const billResult = await pool.query(
            `INSERT INTO bills (order_id, subtotal, tax, discount, total)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [orderId, pricing.subtotal, pricing.tax, pricing.discount || 0, pricing.total]
        );

        res.json({
            success: true,
            data: {
                bill: billResult.rows[0],
                pricing,
                items: order.items
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.addTip = async (req, res) => {
    try {
        const { billId } = req.params;
        const { tip } = req.body;

        const result = await pool.query(
            `UPDATE bills 
             SET tip = $1, final_total = total + $1
             WHERE id = $2
             RETURNING *`,
            [tip, billId]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.payBill = async (req, res) => {
    try {
        const { billId, paymentMethod } = req.params;

        const result = await pool.query(
            `UPDATE bills 
             SET status = 'PAID', payment_method = $1
             WHERE id = $2
             RETURNING *`,
            [paymentMethod, billId]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};