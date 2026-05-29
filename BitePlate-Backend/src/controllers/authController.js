// src/controllers/authController.js
import jwt from 'jsonwebtoken';
import StaffModel from '../models/Staff.js';

export const register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Validation
        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create staff
        const staff = await StaffModel.create({
            name,
            email,
            password,
            role,
            phone
        });

        res.status(201).json({
            success: true,
            message: 'Staff registered successfully',
            data: staff
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password required'
            });
        }

        // Get staff by email
        const staff = await StaffModel.getByEmail(email);
        if (!staff) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValid = await StaffModel.verifyPassword(staff.id, password);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token
        const token = jwt.sign(
            {
                id: staff.id,
                email: staff.email,
                role: staff.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            data: {
                id: staff.id,
                name: staff.name,
                email: staff.email,
                role: staff.role
            }
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const getCurrentStaff = async (req, res) => {
    try {
        const staff = await StaffModel.getById(req.user.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                error: 'Staff not found'
            });
        }

        res.json({
            success: true,
            data: staff
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                error: 'Current and new passwords required'
            });
        }

        // Verify current password
        const isValid = await StaffModel.verifyPassword(req.user.id, currentPassword);
        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: 'Current password is incorrect'
            });
        }

        // Update password
        await StaffModel.updatePassword(req.user.id, newPassword);

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};

export default {
    register,
    login,
    getCurrentStaff,
    updatePassword
};