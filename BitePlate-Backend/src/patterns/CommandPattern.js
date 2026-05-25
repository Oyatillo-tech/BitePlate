const pool = require('../config/database');

class Command {
    async execute() {
        throw new Error('execute must be implemented');
    }

    async undo() {
        throw new Error('undo must be implemented');
    }
}

class PrepareOrderCommand extends Command {
    constructor(orderId) {
        super();
        this.orderId = orderId;
        this.previousStatus = null;
    }

    async execute() {
        const result = await pool.query(
            'SELECT status FROM orders WHERE id = $1',
            [this.orderId]
        );

        if (result.rows.length === 0) {
            throw new Error('Order not found');
        }

        this.previousStatus = result.rows[0].status;

        await pool.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            ['PREPARING', this.orderId]
        );

        await pool.query(
            'UPDATE kitchen_queue SET status = $1, updated_at = NOW() WHERE order_id = $2',
            ['PREPARING', this.orderId]
        );

        // Log command
        await this.logCommand('PREPARE', this.previousStatus, 'PREPARING');

        console.log(`🔥 Order #${this.orderId} is now PREPARING`);
    }

    async undo() {
        await pool.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            [this.previousStatus, this.orderId]
        );

        await pool.query(
            'UPDATE kitchen_queue SET status = $1, updated_at = NOW() WHERE order_id = $2',
            ['PENDING', this.orderId]
        );

        await this.logUndo();
        console.log(`↩️  Order #${this.orderId} reverted to ${this.previousStatus}`);
    }

    async logCommand(type, previous, newState) {
        await pool.query(
            `INSERT INTO command_history (command_type, order_id, previous_state, new_state)
             VALUES ($1, $2, $3, $4)`,
            [type, this.orderId, JSON.stringify({ status: previous }), JSON.stringify({ status: newState })]
        );
    }

    async logUndo() {
        await pool.query(
            `UPDATE command_history SET undone_at = NOW() 
             WHERE order_id = $1 AND undone_at IS NULL
             ORDER BY executed_at DESC LIMIT 1`,
            [this.orderId]
        );
    }
}

class CancelOrderCommand extends Command {
    constructor(orderId) {
        super();
        this.orderId = orderId;
        this.previousState = null;
    }

    async execute() {
        const result = await pool.query(
            'SELECT * FROM orders WHERE id = $1',
            [this.orderId]
        );

        if (result.rows.length === 0) {
            throw new Error('Order not found');
        }

        this.previousState = result.rows[0];

        await pool.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            ['CANCELLED', this.orderId]
        );

        await pool.query(
            'UPDATE kitchen_queue SET status = $1 WHERE order_id = $2',
            ['CANCELLED', this.orderId]
        );

        console.log(`❌ Order #${this.orderId} CANCELLED`);
    }

    async undo() {
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            [this.previousState.status, this.orderId]
        );

        console.log(`↩️  Order #${this.orderId} restored`);
    }
}

class CompleteOrderCommand extends Command {
    constructor(orderId) {
        super();
        this.orderId = orderId;
    }

    async execute() {
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            ['READY', this.orderId]
        );

        await pool.query(
            'UPDATE kitchen_queue SET status = $1 WHERE order_id = $2',
            ['READY', this.orderId]
        );

        console.log(`✅ Order #${this.orderId} is READY`);
    }

    async undo() {
        await pool.query(
            'UPDATE orders SET status = $1 WHERE id = $2',
            ['PREPARING', this.orderId]
        );
    }
}

module.exports = {
    Command,
    PrepareOrderCommand,
    CancelOrderCommand,
    CompleteOrderCommand
};