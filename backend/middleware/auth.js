// ─── Auth Middleware ──────────────────────────────────────────────────────────
import { verifyAccessToken } from '../utils/jwt.js';

// Require valid JWT access token
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
    }

    // DEV-ONLY: mock admin bypass for local testing — disabled in production
    if (token.startsWith('mock-admin-token') && process.env.NODE_ENV !== 'production') {
        console.warn('[Auth] ⚠️  Mock admin token used — disabled in production');
        req.user = { id: 'USR-001', name: 'Admin Sahydri', email: 'care@sahydriorganics.com', role: 'admin' };
        return next();
    }

    try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (err) {
        const msg = err.name === 'TokenExpiredError'
            ? 'Access token expired. Please refresh.'
            : 'Invalid access token.';
        return res.status(401).json({ success: false, message: msg });
    }
};

// Require admin role
export const requireAdmin = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required.' });
    }
    next();
};

// Optional JWT access token (attaches req.user if present, but doesn't block guests)
export const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (token) {
        try {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
        } catch {
            // Token expired or invalid; ignore and treat as guest
        }
    }
    next();
};
