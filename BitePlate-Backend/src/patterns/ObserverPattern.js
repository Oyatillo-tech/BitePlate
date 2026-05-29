// src/patterns/ObserverPattern.js
import pool from '../config/database.js';

class Observer {
    async update(orderData) {
        throw new Error('update() must be implemented');
    }
}

export class WaiterNotifier extends Observer {
    async update(orderData) {
        console.log(`📢 Waiter Notification: Order #${orderData.order_number} status changed to ${orderData.status}`);

        try {
            await pool.query(
                `INSERT INTO notifications (type, title, message, staff_id, order_id)
                 VALUES ($1, $2, $3, $4, $5)`,
                ['ORDER_UPDATE', `Order #${orderData.order_number}`, `Status: ${orderData.status}`, orderData.staff_id, orderData.id]
            );
        } catch (err) {
            console.error('Error creating waiter notification:', err);
        }
    }
}

export class KitchenDisplayNotifier extends Observer {
    async update(orderData) {
        console.log(`🖥️ Kitchen Display: Order #${orderData.order_number} - ${orderData.status}`);

        try {
            await pool.query(
                `INSERT INTO kitchen_display_log (order_id, order_number, status)
                 VALUES ($1, $2, $3)`,
                [orderData.id, orderData.order_number, orderData.status]
            );
        } catch (err) {
            console.error('Error updating kitchen display:', err);
        }
    }
}

export class ManagerDashboardNotifier extends Observer {
    async update(orderData) {
        console.log(`👨‍💼 Manager Alert: Order #${orderData.order_number} - ${orderData.status}`);

        try {
            await pool.query(
                `INSERT INTO manager_alerts (order_id, message, severity)
                 VALUES ($1, $2, $3)`,
                [orderData.id, `Order #${orderData.order_number} status: ${orderData.status}`, 'INFO']
            );
        } catch (err) {
            console.error('Error creating manager alert:', err);
        }
    }
}

export class OrderSubject {
    constructor() {
        this.observers = [];
    }

    attach(observer) {
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }

    detach(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    async notify(orderData) {
        for (const observer of this.observers) {
            await observer.update(orderData);
        }
    }
}

export default OrderSubject;