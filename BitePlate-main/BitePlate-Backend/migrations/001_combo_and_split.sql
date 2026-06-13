-- Combo meals and split bill support

CREATE TABLE IF NOT EXISTS combo_items (
    id SERIAL PRIMARY KEY,
    combo_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bill_splits (
    id SERIAL PRIMARY KEY,
    bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
    label VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_combo_items_combo_id ON combo_items(combo_id);
CREATE INDEX IF NOT EXISTS idx_bill_splits_bill_id ON bill_splits(bill_id);
