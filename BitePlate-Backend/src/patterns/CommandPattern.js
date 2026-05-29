// src/patterns/CommandPattern.js
import pool from '../config/database.js';

class Command {
    async execute() {
        throw new Error('execute() must be implemented');
    }

    async undo() {
        throw new Error('undo() must be implemented');
    }

    async logCommand(type, orderId, previousState, newState) {
        const query = `
            INSERT INTO command_history 
            (command_type, order_id, previous_state, new_state, executed_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        `;

        try {
            await pool.query(query, [
                type,
                orderId,
                JSON.stringify(previousState),
                JSON.stringify(newState)
            ]);
        } catch (err) {
            console.error('❌ Error logging command:', err);
        }
    }
}

export class PrepareOrderCommand extends Command {
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

        await this.logCommand('PREPARE', this.orderId,
            { status: this.previousStatus },
            { status: 'PREPARING' }
        );

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

        console.log(`↩️  Order #${this.orderId} reverted to ${this.previousStatus}`);
    }
}

export class CancelOrderCommand extends Command {
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
            'UPDATE kitchen_queue SET status = $1, updated_at = NOW() WHERE order_id = $2',
            ['CANCELLED', this.orderId]
        );

        await this.logCommand('CANCEL', this.orderId,
            { status: this.previousState.status },
            { status: 'CANCELLED' }
        );

        console.log(`❌ Order #${this.orderId} CANCELLED`);
    }

    async undo() {
        await pool.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            [this.previousState.status, this.orderId]
        );

        console.log(`↩️  Order #${this.orderId} restored`);
    }
}

export class CompleteOrderCommand extends Command {
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
            ['READY', this.orderId]
        );

        await pool.query(
            'UPDATE kitchen_queue SET status = $1, updated_at = NOW() WHERE order_id = $2',
            ['READY', this.orderId]
        );

        await this.logCommand('COMPLETE', this.orderId,
            { status: this.previousStatus },
            { status: 'READY' }
        );

        console.log(`✅ Order #${this.orderId} is READY`);
    }

    async undo() {
        await pool.query(
            'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2',
            [this.previousStatus, this.orderId]
        );

        console.log(`↩️  Order #${this.orderId} reverted`);
    }
}

export class KitchenQueue {
    constructor() {
        this.queue = [];
        this.history = [];
    }

    enqueue(command) {
        this.queue.push(command);
        this.history.push(command);
        return command;
    }

    async undoLast() {
        if (this.history.length > 0) {
            const lastCommand = this.history.pop();
            await lastCommand.undo();
            return lastCommand;
        }
        return null;
    }

    getQueueStatus() {
        return {
            queueLength: this.queue.length,
            historyLength: this.history.length
        };
    }

    async getKitchenQueue() {
        const query = `
            SELECT kq.*, o.order_number, o.created_at
            FROM kitchen_queue kq
            JOIN orders o ON kq.order_id = o.id
            WHERE kq.status IN ('PENDING', 'PREPARING')
            ORDER BY kq.priority DESC, kq.created_at ASC
        `;
        const result = await pool.query(query);
        return result.rows;
    }

    async updatePriority(orderId, priority) {
        const query = `
            UPDATE kitchen_queue
            SET priority = $1, updated_at = NOW()
            WHERE order_id = $2
            RETURNING *
        `;
        const result = await pool.query(query, [priority, orderId]);
        return result.rows[0];
    }
}

export default KitchenQueue;