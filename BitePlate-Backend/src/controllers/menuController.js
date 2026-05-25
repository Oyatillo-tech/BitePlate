const MenuItem = require('../models/MenuItem');

exports.getAllMenu = async (req, res) => {
    try {
        const items = await MenuItem.getAll();
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMenuByType = async (req, res) => {
    try {
        const { type } = req.params;
        const items = await MenuItem.getAllByType(type);
        res.json({ success: true, data: items });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItem.getById(id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Item not found' });
        }
        res.json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.createMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.create(req.body);
        res.status(201).json({ success: true, data: item });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};