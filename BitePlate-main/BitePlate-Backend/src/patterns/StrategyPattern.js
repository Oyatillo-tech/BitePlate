// src/patterns/StrategyPattern.js

class PricingStrategy {
    calculateTotal(subtotal) {
        throw new Error('calculateTotal must be implemented');
    }
}

export class StandardPricing extends PricingStrategy {
    calculateTotal(subtotal, discountPercentage = 0) {
        let discountedSubtotal = subtotal;
        let discount = 0;

        if (discountPercentage > 0) {
            discount = subtotal * (discountPercentage / 100);
            discountedSubtotal = subtotal - discount;
        }

        const tax = discountedSubtotal * 0.2; // 20% VAT

        return {
            subtotal,
            discount,
            subtotalAfterDiscount: discountedSubtotal,
            tax,
            total: discountedSubtotal + tax,
            strategy: 'STANDARD'
        };
    }
}

export class HappyHourPricing extends PricingStrategy {
    // 20% discount 3pm-5pm
    calculateTotal(subtotal, discountPercentage = 0) {
        const baseDiscount = subtotal * 0.2;
        let additionalDiscount = subtotal * (discountPercentage / 100);
        const totalDiscount = baseDiscount + additionalDiscount;

        const discountedSubtotal = subtotal - totalDiscount;
        const tax = discountedSubtotal * 0.2;

        return {
            subtotal,
            baseDiscount,
            additionalDiscount,
            totalDiscount,
            subtotalAfterDiscount: discountedSubtotal,
            tax,
            total: discountedSubtotal + tax,
            strategy: 'HAPPY_HOUR'
        };
    }

    isActive() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 15 && hour < 17;
    }
}

export class LoyaltyCardPricing extends PricingStrategy {
    // 10% discount
    calculateTotal(subtotal, discountPercentage = 10) {
        const discount = subtotal * (discountPercentage / 100);
        const discountedSubtotal = subtotal - discount;
        const tax = discountedSubtotal * 0.2;

        return {
            subtotal,
            discount,
            subtotalAfterDiscount: discountedSubtotal,
            tax,
            total: discountedSubtotal + tax,
            strategy: 'LOYALTY_CARD'
        };
    }
}

export class WeekendSurchargePricing extends PricingStrategy {
    // 15% surcharge Sat/Sun
    calculateTotal(subtotal, discountPercentage = 0) {
        let finalSubtotal = subtotal;
        let discount = 0;

        if (discountPercentage > 0) {
            discount = subtotal * (discountPercentage / 100);
            finalSubtotal = subtotal - discount;
        }

        const surcharge = finalSubtotal * 0.15;
        const surcharged = finalSubtotal + surcharge;
        const tax = surcharged * 0.2;

        return {
            subtotal,
            discount,
            surcharge,
            subtotalAfterSurcharge: surcharged,
            tax,
            total: surcharged + tax,
            strategy: 'WEEKEND'
        };
    }

    isActive() {
        const now = new Date();
        const day = now.getDay();
        return day === 5 || day === 6; // Friday, Saturday
    }
}

export class GroupDiscountPricing extends PricingStrategy {
    constructor(partySize = 6) {
        super();
        this.partySize = partySize;
    }

    calculateTotal(subtotal, discountPercentage = 0) {
        let discount = 0;

        if (this.partySize >= 6) {
            discount = subtotal * 0.15; // 15% for groups of 6+
        } else if (discountPercentage > 0) {
            discount = subtotal * (discountPercentage / 100);
        }

        const discountedSubtotal = subtotal - discount;
        const tax = discountedSubtotal * 0.2;

        return {
            subtotal,
            discount,
            subtotalAfterDiscount: discountedSubtotal,
            tax,
            total: discountedSubtotal + tax,
            strategy: 'GROUP_DISCOUNT',
            partySize: this.partySize
        };
    }
}

export class CorporateAccountPricing extends PricingStrategy {
    constructor(discountRate = 12) {
        super();
        this.discountRate = discountRate;
    }

    calculateTotal(subtotal, additionalDiscount = 0) {
        const baseDiscount = subtotal * (this.discountRate / 100);
        const additionalDiscountAmount = subtotal * (additionalDiscount / 100);
        const totalDiscount = baseDiscount + additionalDiscountAmount;

        const discountedSubtotal = subtotal - totalDiscount;
        const tax = discountedSubtotal * 0.2;

        return {
            subtotal,
            baseDiscount,
            additionalDiscount: additionalDiscountAmount,
            totalDiscount,
            subtotalAfterDiscount: discountedSubtotal,
            tax,
            total: discountedSubtotal + tax,
            strategy: 'CORPORATE',
            discountRate: this.discountRate
        };
    }
}

export function getPricingStrategy(type, params = {}) {
    switch (type) {
        case 'STANDARD':
            return new StandardPricing();
        case 'HAPPY_HOUR':
            return new HappyHourPricing();
        case 'LOYALTY_CARD':
            return new LoyaltyCardPricing();
        case 'WEEKEND':
            return new WeekendSurchargePricing();
        case 'GROUP':
            return new GroupDiscountPricing(params.partySize || 6);
        case 'CORPORATE':
            return new CorporateAccountPricing(params.discountRate || 12);
        default:
            return new StandardPricing();
    }
}

export default PricingStrategy;