import express    from 'express';
import cors       from 'cors';
import helmet     from 'helmet';
import rateLimit  from 'express-rate-limit';
import path       from 'path';
import { fileURLToPath } from 'url';

import productRoutes  from './routes/productRoutes.js';
import orderRoutes    from './routes/orderRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';
import authRoutes     from './routes/authRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import uploadRoutes   from './routes/uploadRoutes.js';
import { initDatabase, isDatabaseConnected } from './config/db.js';
import { csrfProtection, csrfTokenHandler } from './middleware/csrf.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 5000;
const isDev = process.env.NODE_ENV !== 'production';

// Static uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token', 'csrf-token'],
    exposedHeaders: ['X-CSRF-Token'],
}));

// ── Body Parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '15mb' }));   // allow high-res image uploads and base64 payloads

// ── Global API rate limit ─────────────────────────────────────────────────────
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,   // 15 minutes
    max: isDev ? 2000 : 300,    // relaxed in dev
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, message: 'Rate limit exceeded. Try again later.' },
});
app.use('/api', globalLimiter);

// ── CSRF Token Endpoint (Public GET) ───────────────────────────────────────────
app.get('/api/csrf-token', csrfTokenHandler);

// ── Enforce CSRF Protection on Mutating Requests (POST, PUT, PATCH, DELETE) ────
app.use('/api', csrfProtection);

// ── Public Routes ─────────────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);

// ── Order, Shipping & Payment Routes ──────────────────────────────────────────
app.use('/api/orders',   orderRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/upload',   uploadRoutes);

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
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

// ── Global Error Handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
    console.error(`[Server Error] ${req.method} ${req.path}:`, err.stack || err.message);
    const statusCode = err.status || err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: isDev ? err.message : 'Internal server error.',
        ...(isDev && { stack: err.stack })
    });
});

// ── Start Server & Initialize Database ────────────────────────────────────────
async function startServer() {
    await initDatabase();
    const server = app.listen(PORT, () => {
        console.log(`✅ Sahydri API running → http://localhost:${PORT} [${process.env.NODE_ENV}]`);
    });
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`⚠️  Port ${PORT} is in use. Please terminate the conflicting process.`);
        } else {
            console.error('[Server Error]', err);
        }
    });
}

startServer();
