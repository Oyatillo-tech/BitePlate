// src/controllers/menuController.js
import MenuItemModel from '../models/MenuItem.js';

export const getAllMenu = async (req, res) => {
    try {
        const items = await MenuItemModel.getAll();
        res.json({
            success: true,
            data: items
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getMenuByType = async (req, res) => {
    try {
        const { type } = req.params;

        const validTypes = ['STARTER', 'MAIN', 'DESSERT', 'BEVERAGE'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid menu type'
            });
        }

        const items = await MenuItemModel.getAllByType(type);
        res.json({
            success: true,
            data: items
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItemModel.getById(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const createMenuItem = async (req, res) => {
    try {
        const { name, type, description, price, prep_time, vegan, allergens } = req.body;

        if (!name || !type || price === undefined) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        const item = await MenuItemModel.create({
            name,
            type,
            description,
            price,
            prep_time,
            vegan: vegan || false,
            allergens
        });

        res.status(201).json({
            success: true,
            data: item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItemModel.update(id, req.body);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await MenuItemModel.delete(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            message: 'Menu item deleted'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const toggleAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await MenuItemModel.toggleAvailability(id);

        if (!item) {
            return res.status(404).json({
                success: false,
                error: 'Menu item not found'
            });
        }

        res.json({
            success: true,
            data: item
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const searchMenu = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query required'
            });
        }

        const items = await MenuItemModel.search(query);
        res.json({
            success: true,
            data: items
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getVeganItems = async (req, res) => {
    try {
        const items = await MenuItemModel.getVeganItems();
        res.json({
            success: true,
            data: items
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getItemsByAllergen = async (req, res) => {
    try {
        const { allergen } = req.query;

        if (!allergen) {
            return res.status(400).json({
                success: false,
                error: 'Allergen parameter required'
            });
        }

        const items = await MenuItemModel.getItemsByAllergen(allergen);
        res.json({
            success: true,
            data: items
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    getAllMenu,
    getMenuByType,
    getMenuItem,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    searchMenu,
    getVeganItems,
    getItemsByAllergen
};