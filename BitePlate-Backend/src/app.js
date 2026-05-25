const express = require('express');
const cors = require('cors');
require('dotenv').config();

const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const tableRoutes = require('./routes/tableRoutes');
const billRoutes = require('./routes/billRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/bills', billRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Backend running' });
});

module.exports = app;