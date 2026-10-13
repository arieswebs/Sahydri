// ─── Auth Middleware ──────────────────────────────────────────────────────────
import { verifyAccessToken } from '../utils/jwt.js';

// Require valid JWT access token
export const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required.' });
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
