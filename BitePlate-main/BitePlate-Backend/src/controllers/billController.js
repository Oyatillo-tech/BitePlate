// src/controllers/billController.js
import BillModel from '../models/Bill.js';
import OrderModel from '../models/Order.js';
import { getPricingStrategy } from '../patterns/StrategyPattern.js';

export const generateBill = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { pricingStrategy = 'STANDARD', partySize = 1 } = req.body;

        // Get order
        const order = await OrderModel.getById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }

        // Calculate subtotal
        const subtotal = order.items.reduce((sum, item) => sum + (item.item_price * item.quantity), 0);

        // Get pricing strategy and calculate
        const strategy = getPricingStrategy(pricingStrategy, { partySize });
        const pricing = strategy.calculateTotal(subtotal);

        // Create bill
        const bill = await BillModel.create(orderId, pricing);

        res.status(201).json({
            success: true,
            data: {
                bill,
                pricing,
                items: order.items
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const bill = await BillModel.getById(billId);

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found'
            });
        }

        const splits = await BillModel.getSplits(billId);

        res.json({
            success: true,
            data: { ...bill, splits }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getBillByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const bill = await BillModel.getByOrderId(orderId);

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found for this order'
            });
        }

        res.json({
            success: true,
            data: bill
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const addTip = async (req, res) => {
    try {
        const { billId } = req.params;
        const { tip } = req.body;

        if (tip === undefined || tip < 0) {
            return res.status(400).json({
                success: false,
                error: 'Invalid tip amount'
            });
        }

        const bill = await BillModel.addTip(billId, tip);

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found'
            });
        }

        res.json({
            success: true,
            message: 'Tip added',
            data: bill
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const payBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const { paymentMethod = 'CARD' } = req.body;

        const bill = await BillModel.pay(billId, paymentMethod);

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found'
            });
        }

        res.json({
            success: true,
            message: 'Payment processed',
            data: bill
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const refundBill = async (req, res) => {
    try {
        const { billId } = req.params;

        const bill = await BillModel.refund(billId);

        if (!bill) {
            return res.status(404).json({
                success: false,
                error: 'Bill not found'
            });
        }

        res.json({
            success: true,
            message: 'Bill refunded',
            data: bill
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getPendingBills = async (req, res) => {
    try {
        const bills = await BillModel.getPendingBills();

        const enriched = await Promise.all(
            bills.map(async (bill) => {
                if (bill.status === 'SPLIT') {
                    const splits = await BillModel.getSplits(bill.id);
                    return { ...bill, splits };
                }
                return bill;
            })
        );

        res.json({
            success: true,
            count: enriched.length,
            data: enriched
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getBillsByDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Start and end dates required'
            });
        }

        const bills = await BillModel.getBillsByDateRange(startDate, endDate);

        res.json({
            success: true,
            count: bills.length,
            data: bills
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getTotalRevenue = async (req, res) => {
    try {
        const { days } = req.query;
        const revenue = await BillModel.getTotalRevenue(days ? parseInt(days) : null);

        res.json({
            success: true,
            data: {
                totalRevenue: revenue,
                period: days ? `Last ${days} days` : 'All time'
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getRevenueByPaymentMethod = async (req, res) => {
    try {
        const { days } = req.query;
        const revenue = await BillModel.getRevenueByPaymentMethod(days ? parseInt(days) : 30);

        res.json({
            success: true,
            data: revenue
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const splitBill = async (req, res) => {
    try {
        const { billId } = req.params;
        const { splits } = req.body;

        if (!splits || !Array.isArray(splits) || splits.length < 2) {
            return res.status(400).json({
                success: false,
                error: 'At least 2 splits required'
            });
        }

        const createdSplits = await BillModel.splitBill(billId, splits);

        res.json({
            success: true,
            message: 'Bill split successfully',
            data: createdSplits
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export const paySplit = async (req, res) => {
    try {
        const { splitId } = req.params;
        const { paymentMethod = 'CARD' } = req.body;

        const split = await BillModel.paySplit(splitId, paymentMethod);

        res.json({
            success: true,
            message: 'Split payment processed',
            data: split
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    generateBill,
    getBill,
    getBillByOrder,
    addTip,
    payBill,
    refundBill,
    splitBill,
    paySplit,
    getPendingBills,
    getBillsByDateRange,
    getTotalRevenue,
    getRevenueByPaymentMethod
};