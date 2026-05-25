const Table = require('../models/Table');

exports.getAllTables = async (req, res) => {
    try {
        const tables = await Table.getAll();
        res.json({ success: true, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.getAvailableTables = async (req, res) => {
    try {
        const { partySize } = req.query;

        if (!partySize) {
            return res.status(400).json({
                success: false,
                error: 'partySize is required'
            });
        }

        const tables = await Table.getAvailableTables(partySize);
        res.json({ success: true, data: tables });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.seatTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.seat(tableId);
        res.json({ success: true, data: table });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

exports.clearTable = async (req, res) => {
    try {
        const { tableId } = req.params;
        const table = await Table.clear(tableId);
        res.json({ success: true, data: table });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};