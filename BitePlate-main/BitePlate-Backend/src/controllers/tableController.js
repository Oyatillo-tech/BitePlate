// src/controllers/tableController.js
import TableModel from '../models/Table.js';

export const getAllTables = async (req, res) => {
    try {
        const tables = await TableModel.getAll();

        res.json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await TableModel.getById(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getAvailableTables = async (req, res) => {
    try {
        const { partySize } = req.query;

        if (!partySize) {
            return res.status(400).json({
                success: false,
                error: 'partySize is required'
            });
        }

        const tables = await TableModel.getAvailableTables(partySize);

        res.json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const seatTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await TableModel.seat(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            message: 'Table occupied',
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const clearTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await TableModel.clear(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            message: 'Table cleared',
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const reserveTable = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await TableModel.reserve(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            message: 'Table reserved',
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const tableAwaitingBill = async (req, res) => {
    try {
        const { id } = req.params;
        const table = await TableModel.awaitBill(id);

        if (!table) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            message: 'Table awaiting bill',
            data: table
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getTableStatus = async (req, res) => {
    try {
        const status = await TableModel.getTableStatus();

        res.json({
            success: true,
            data: status
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getOccupiedTables = async (req, res) => {
    try {
        const tables = await TableModel.getOccupiedTables();

        res.json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getFreeTables = async (req, res) => {
    try {
        const tables = await TableModel.getFreeTables();

        res.json({
            success: true,
            count: tables.length,
            data: tables
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const createTable = async (req, res) => {
    try {
        const { tableNumber, capacity } = req.body;

        if (!tableNumber || !capacity) {
            return res.status(400).json({
                success: false,
                error: 'Table number and capacity required'
            });
        }

        const table = await TableModel.create(tableNumber, capacity);

        res.status(201).json({
            success: true,
            data: table
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await TableModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Table not found'
            });
        }

        res.json({
            success: true,
            message: 'Table deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    getAllTables,
    getTable,
    getAvailableTables,
    seatTable,
    clearTable,
    reserveTable,
    tableAwaitingBill,
    getTableStatus,
    getOccupiedTables,
    getFreeTables,
    createTable,
    deleteTable
};