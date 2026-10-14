import express    from 'express';
import cors       from 'cors';
import helmet     from 'helmet';
import rateLimit  from 'express-rate-limit';

import productRoutes  from './routes/productRoutes.js';
import orderRoutes    from './routes/orderRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';
import authRoutes     from './routes/authRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import { initDatabase, isDatabaseConnected } from './config/db.js';

const app  = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

// ── Security headers (Helmet) ─────────────────────────────────────────────────
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
    .split(',').map(o => o.trim());

app.use(cors({
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '100kb' }));   // reject oversized payloads

// ── Global API rate limit ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: isDev ? 2000 : 300,    // relaxed in dev
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Rate limit exceeded. Try again later.' },
});
app.use('/api', globalLimiter);

// ── Public Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);

// ── Order, Shipping & Payment Routes ──────────────────────────────────────────
app.use('/api/orders',   orderRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/razorpay', razorpayRoutes);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) =>
    res.json({
        status: 'ok',
        database: isDatabaseConnected() ? 'connected (mysql)' : 'fallback (memory)',
        env: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    })
);

// ── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
    console.error('[Server Error]', err.message);
    res.status(500).json({ success: false, message: isDev ? err.message : 'Internal server error.' });
});

// ── Start Server & Initialize Database ────────────────────────────────────────
async function startServer() {
    await initDatabase();
    app.listen(PORT, () => {
        console.log(`✅ Sahyadri API running → http://localhost:${PORT} [${process.env.NODE_ENV}]`);
    });
}

startServer();
