// src/patterns/FactoryPattern.js

class MenuItem {
    constructor(id, name, price, description, type) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.type = type;
    }

    getDescription() {
        return `${this.name} - £${this.price}`;
    }
}

class Starter extends MenuItem {
    constructor(id, name, price, description, prepTime) {
        super(id, name, price, description, 'STARTER');
        this.prepTime = prepTime;
    }

    getDescription() {
        return `🥗 Starter: ${this.name} - £${this.price} (${this.prepTime}min)`;
    }
}

class MainCourse extends MenuItem {
    constructor(id, name, price, description, servingSize) {
        super(id, name, price, description, 'MAIN');
        this.servingSize = servingSize;
    }

    getDescription() {
        return `🍽️ Main: ${this.name} - £${this.price} (${this.servingSize})`;
    }
}

class Dessert extends MenuItem {
    constructor(id, name, price, description, vegan = false) {
        super(id, name, price, description, 'DESSERT');
        this.vegan = vegan;
    }

    getDescription() {
        const vegan = this.vegan ? ' 🌱 Vegan' : '';
        return `🍰 Dessert: ${this.name} - £${this.price}${vegan}`;
    }
}

class Beverage extends MenuItem {
    constructor(id, name, price, description, alcoholic = false) {
        super(id, name, price, description, 'BEVERAGE');
        this.alcoholic = alcoholic;
    }

    getDescription() {
        const alc = this.alcoholic ? ' 🍷' : '';
        return `🥤 Beverage: ${this.name} - £${this.price}${alc}`;
    }
}

class ComboMeal extends MenuItem {
    constructor(id, name, price, description, items = []) {
        super(id, name, price, description, 'COMBO');
        this.items = items;
    }

    getDescription() {
        const itemNames = this.items.map(i => i.name).join(', ');
        return `🍱 Combo: ${this.name} - £${this.price} (${itemNames})`;
    }
}

export class MenuItemFactory {
    static createMenuItem(type, id, name, price, description, extraData) {
        switch (type.toUpperCase()) {
            case 'STARTER':
                return new Starter(id, name, price, description, extraData.prepTime || 5);
            case 'MAIN':
                return new MainCourse(id, name, price, description, extraData.servingSize || 'Regular');
            case 'DESSERT':
                return new Dessert(id, name, price, description, extraData.vegan || false);
            case 'BEVERAGE':
                return new Beverage(id, name, price, description, extraData.alcoholic || false);
            case 'COMBO':
                return new ComboMeal(id, name, price, description, extraData.items || []);
            default:
                return new MenuItem(id, name, price, description, type);
        }
    }

    static createFromDatabase(dbRecord) {
        return this.createMenuItem(
            dbRecord.type,
            dbRecord.id,
            dbRecord.name,
            dbRecord.price,
            dbRecord.description,
            {
                prepTime: dbRecord.prep_time,
                servingSize: dbRecord.serving_size,
                vegan: dbRecord.vegan,
                alcoholic: dbRecord.alcoholic,
                items: dbRecord.items || []
            }
        );
    }
}

export { MenuItem, Starter, MainCourse, Dessert, Beverage, ComboMeal };