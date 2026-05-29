// server.js
import app from './src/app.js';
import dotenv from 'dotenv';
import pool from './src/config/database.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test database connection
pool.query('SELECT NOW()', (err, result) => {
    if (err) {
        console.error('❌ Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('✅ Database connected');
    }
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════════════════╗
    ║          BitePlate Backend Server                  ║
    ║       🚀 Server running on port ${PORT}           ║
    ║                                                    ║
    ║  📍 API URL: http://localhost:${PORT}/api/v1      ║
    ║  📖 Health: http://localhost:${PORT}/health       ║
    ║                                                    ║
    ║  Environment: ${process.env.NODE_ENV}              ║
    ╚════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        pool.end(() => {
            console.log('Database pool closed');
            process.exit(0);
        });
    });
});