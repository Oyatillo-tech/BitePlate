// Strategy Pattern - Pricing Strategies

class PricingStrategy {
    calculateTotal(subtotal) {
        throw new Error('calculateTotal must be implemented');
    }
}

class StandardPricing extends PricingStrategy {
    calculateTotal(subtotal) {
        const tax = subtotal * 0.2; // 20% VAT
        return {
            subtotal,
            tax,
            total: subtotal + tax,
            discount: 0,
            strategy: 'STANDARD'
        };
    }
}

class HappyHourPricing extends PricingStrategy {
    // 20% discount 3pm-5pm
    calculateTotal(subtotal) {
        const discounted = subtotal * 0.8;
        const tax = discounted * 0.2;
        return {
            subtotal,
            discount: subtotal * 0.2,
            subtotalAfterDiscount: discounted,
            tax,
            total: discounted + tax,
            strategy: 'HAPPY_HOUR'
        };
    }

    isActive() {
        const now = new Date();
        const hour = now.getHours();
        return hour >= 15 && hour < 17;
    }
}

class LoyaltyCardPricing extends PricingStrategy {
    // 10% discount + 5 free on drinks
    calculateTotal(subtotal) {
        const discounted = subtotal * 0.9;
        const tax = discounted * 0.2;
        return {
            subtotal,
            discount: subtotal * 0.1,
            subtotalAfterDiscount: discounted,
            tax,
            total: discounted + tax,
            strategy: 'LOYALTY_CARD'
        };
    }
}

class WeekendSurchargePricing extends PricingStrategy {
    // 15% surcharge Sat/Sun
    calculateTotal(subtotal) {
        const surcharged = subtotal * 1.15;
        const tax = surcharged * 0.2;
        return {
            subtotal,
            surcharge: subtotal * 0.15,
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

class GroupDiscountPricing extends PricingStrategy {
    constructor(partySize = 6) {
        super();
        this.partySize = partySize;
    }

    calculateTotal(subtotal) {
        if (this.partySize >= 6) {
            const discounted = subtotal * 0.85; // 15% for groups of 6+
            const tax = discounted * 0.2;
            return {
                subtotal,
                discount: subtotal * 0.15,
                subtotalAfterDiscount: discounted,
                tax,
                total: discounted + tax,
                strategy: 'GROUP_DISCOUNT'
            };
        }
        return new StandardPricing().calculateTotal(subtotal);
    }
}

module.exports = {
    PricingStrategy,
    StandardPricing,
    HappyHourPricing,
    LoyaltyCardPricing,
    WeekendSurchargePricing,
    GroupDiscountPricing
};