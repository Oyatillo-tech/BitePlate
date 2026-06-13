-- BitePlate core schema and seed data

CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(20) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    prep_time INTEGER DEFAULT 10,
    vegan BOOLEAN DEFAULT FALSE,
    allergens TEXT,
    serving_size VARCHAR(50),
    alcoholic BOOLEAN DEFAULT FALSE,
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS restaurant_tables (
    id SERIAL PRIMARY KEY,
    table_number INTEGER UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'FREE',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    table_id INTEGER REFERENCES restaurant_tables(id),
    staff_id INTEGER REFERENCES staff(id),
    status VARCHAR(20) DEFAULT 'CREATED',
    subtotal DECIMAL(10, 2) DEFAULT 0,
    tax DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) DEFAULT 0,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id INTEGER REFERENCES menu_items(id),
    quantity INTEGER DEFAULT 1,
    item_price DECIMAL(10, 2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kitchen_queue (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING',
    priority INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bills (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    subtotal DECIMAL(10, 2) NOT NULL,
    tax DECIMAL(10, 2) NOT NULL,
    discount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    tip DECIMAL(10, 2) DEFAULT 0,
    final_total DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'PENDING',
    payment_method VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    table_id INTEGER REFERENCES restaurant_tables(id),
    customer_name VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(30),
    customer_email VARCHAR(150),
    reservation_time TIMESTAMP NOT NULL,
    party_size INTEGER NOT NULL,
    special_requests TEXT,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_history_log (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    order_number VARCHAR(50),
    table_number INTEGER,
    staff_id INTEGER,
    items JSONB,
    total DECIMAL(10, 2),
    timestamp TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS command_history (
    id SERIAL PRIMARY KEY,
    command_type VARCHAR(50),
    order_id INTEGER,
    previous_state JSONB,
    new_state JSONB,
    executed_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50),
    title VARCHAR(150),
    message TEXT,
    staff_id INTEGER,
    order_id INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kitchen_display_log (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    order_number VARCHAR(50),
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manager_alerts (
    id SERIAL PRIMARY KEY,
    order_id INTEGER,
    message TEXT,
    severity VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Seed staff (password: password123)
INSERT INTO staff (name, email, password_hash, role, phone) VALUES
('Alice Waiter', 'alice@biteplate.com', '$2a$10$m594vmqLvR564o7hMwtIU.Slh/gsUHxkQl453VHpcijBzNwU0mGO.', 'WAITER', '0700000001'),
('Bob Chef', 'bob@biteplate.com', '$2a$10$m594vmqLvR564o7hMwtIU.Slh/gsUHxkQl453VHpcijBzNwU0mGO.', 'CHEF', '0700000002'),
('Carol Cashier', 'carol@biteplate.com', '$2a$10$m594vmqLvR564o7hMwtIU.Slh/gsUHxkQl453VHpcijBzNwU0mGO.', 'CASHIER', '0700000003'),
('Dave Manager', 'dave@biteplate.com', '$2a$10$m594vmqLvR564o7hMwtIU.Slh/gsUHxkQl453VHpcijBzNwU0mGO.', 'MANAGER', '0700000004')
ON CONFLICT (email) DO NOTHING;

INSERT INTO restaurant_tables (table_number, capacity, status) VALUES
(1, 2, 'FREE'), (2, 4, 'FREE'), (3, 4, 'FREE'), (4, 6, 'FREE'), (5, 8, 'FREE')
ON CONFLICT (table_number) DO NOTHING;

INSERT INTO menu_items (name, type, description, price, prep_time, vegan, allergens, serving_size, alcoholic) VALUES
('Caesar Salad', 'STARTER', 'Crisp romaine with parmesan', 6.50, 5, FALSE, 'dairy, gluten', 'Regular', FALSE),
('Tomato Soup', 'STARTER', 'Classic creamy tomato soup', 5.00, 8, TRUE, NULL, 'Bowl', FALSE),
('Grilled Salmon', 'MAIN', 'Atlantic salmon with vegetables', 18.99, 20, FALSE, 'fish', 'Regular', FALSE),
('Beef Burger', 'MAIN', 'Angus beef with fries', 14.50, 15, FALSE, 'gluten', 'Regular', FALSE),
('Vegan Buddha Bowl', 'MAIN', 'Quinoa, chickpeas, avocado', 13.00, 12, TRUE, NULL, 'Regular', FALSE),
('Chocolate Cake', 'DESSERT', 'Rich chocolate layer cake', 6.00, 5, FALSE, 'dairy, gluten, eggs', 'Slice', FALSE),
('Fruit Sorbet', 'DESSERT', 'Seasonal fruit sorbet', 4.50, 3, TRUE, NULL, 'Scoop', FALSE),
('Cola', 'BEVERAGE', 'Chilled soft drink', 2.50, 1, TRUE, NULL, '330ml', FALSE),
('House Red Wine', 'BEVERAGE', 'Glass of house red', 5.50, 1, TRUE, 'sulphites', '175ml', TRUE);
