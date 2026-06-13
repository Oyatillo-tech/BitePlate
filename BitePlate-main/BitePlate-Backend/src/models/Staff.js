// src/models/Staff.js
import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

class StaffModel {
    static async getAll() {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, phone, created_at FROM staff ORDER BY name'
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching staff:', err);
            throw err;
        }
    }

    static async getById(id) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role, phone, created_at FROM staff WHERE id = $1',
                [id]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching staff member:', err);
            throw err;
        }
    }

    static async getByEmail(email) {
        try {
            const result = await pool.query(
                'SELECT * FROM staff WHERE email = $1',
                [email]
            );
            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error fetching staff by email:', err);
            throw err;
        }
    }

    static async getByRole(role) {
        try {
            const result = await pool.query(
                'SELECT id, name, email, role FROM staff WHERE role = $1 ORDER BY name',
                [role]
            );
            return result.rows;
        } catch (err) {
            console.error('❌ Error fetching staff by role:', err);
            throw err;
        }
    }

    static async create(data) {
        try {
            const { name, email, password, role, phone } = data;

            // Check if email exists
            const existing = await this.getByEmail(email);
            if (existing) {
                throw new Error('Email already registered');
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            const result = await pool.query(
                `INSERT INTO staff (name, email, password_hash, role, phone)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, name, email, role, phone, created_at`,
                [name, email, passwordHash, role, phone]
            );

            return result.rows[0];
        } catch (err) {
            console.error('❌ Error creating staff:', err);
            throw err;
        }
    }

    static async update(id, data) {
        try {
            const { name, phone, role } = data;

            const result = await pool.query(
                `UPDATE staff 
                SET name = COALESCE($1, name),
                    phone = COALESCE($2, phone),
                    role = COALESCE($3, role)
                WHERE id = $4
                RETURNING id, name, email, role, phone, created_at`,
                [name, phone, role, id]
            );

            return result.rows[0] || null;
        } catch (err) {
            console.error('❌ Error updating staff:', err);
            throw err;
        }
    }

    static async updatePassword(id, newPassword) {
        try {
            const passwordHash = await bcrypt.hash(newPassword, 10);

            const result = await pool.query(
                'UPDATE staff SET password_hash = $1 WHERE id = $2 RETURNING id',
                [passwordHash, id]
            );

            return result.rows.length > 0;
        } catch (err) {
            console.error('❌ Error updating password:', err);
            throw err;
        }
    }

    static async delete(id) {
        try {
            const result = await pool.query(
                'DELETE FROM staff WHERE id = $1 RETURNING *',
                [id]
            );
            return result.rowCount > 0;
        } catch (err) {
            console.error('❌ Error deleting staff:', err);
            throw err;
        }
    }

    static async verifyPassword(id, password) {
        try {
            const staff = await pool.query(
                'SELECT password_hash FROM staff WHERE id = $1',
                [id]
            );

            if (staff.rows.length === 0) {
                return false;
            }

            return await bcrypt.compare(password, staff.rows[0].password_hash);
        } catch (err) {
            console.error('❌ Error verifying password:', err);
            throw err;
        }
    }

    static hasPermission(role, action) {
        const permissions = {
            MANAGER: ['view_orders', 'create_orders', 'modify_orders', 'pay_bills', 'view_kitchen', 'manage_kitchen', 'view_analytics', 'manage_staff'],
            WAITER: ['view_orders', 'create_orders', 'modify_orders', 'view_kitchen'],
            CHEF: ['view_kitchen', 'manage_kitchen'],
            CASHIER: ['view_orders', 'pay_bills', 'view_analytics']
        };

        return (permissions[role] || []).includes(action);
    }
}

export default StaffModel;