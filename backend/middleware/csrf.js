// ─── CSRF Protection Middleware & Token Generation ─────────────────────────────
import crypto from 'crypto';

// Secret used to sign HMAC CSRF tokens
const CSRF_SECRET = process.env.CSRF_SECRET || 
                    process.env.JWT_SECRET || 
                    'sahydri_secure_csrf_secret_salt_2026_x89a0f41c';

// Token validity window: 24 hours (in milliseconds)
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Generate a cryptographically secure, HMAC-signed CSRF token.
 * Format: <salt>.<timestamp>.<hmacSignature>
 */
export function generateCsrfToken() {
    const salt = crypto.randomBytes(16).toString('hex');
    const timestamp = Date.now().toString();
    const dataToSign = `${salt}:${timestamp}`;
    const signature = crypto.createHmac('sha256', CSRF_SECRET).update(dataToSign).digest('hex');
    return `${salt}.${timestamp}.${signature}`;
}

/**
 * Verify whether a provided CSRF token string is authentic and not expired.
 */
export function verifyCsrfToken(token) {
    if (!token || typeof token !== 'string') return false;

    const parts = token.split('.');
    if (parts.length !== 3) return false;

    const [salt, timestampStr, providedSignature] = parts;
    const timestamp = parseInt(timestampStr, 10);

    if (isNaN(timestamp)) return false;

    // Check expiration
    const now = Date.now();
    if (now - timestamp > TOKEN_TTL_MS || timestamp > now + 60000) {
        return false;
    }

    // Recompute HMAC signature
    const dataToSign = `${salt}:${timestampStr}`;
    const expectedSignature = crypto.createHmac('sha256', CSRF_SECRET).update(dataToSign).digest('hex');

    // Constant-time comparison to prevent timing attacks
    try {
        const bufA = Buffer.from(providedSignature, 'hex');
        const bufB = Buffer.from(expectedSignature, 'hex');
        if (bufA.length !== bufB.length) return false;
        return crypto.timingSafeEqual(bufA, bufB);
    } catch {
        return false;
    }
}

/**
 * Express middleware to enforce CSRF token validation on all mutating HTTP methods
 * (POST, PUT, PATCH, DELETE). Safe methods (GET, HEAD, OPTIONS) pass through.
 */
export function csrfProtection(req, res, next) {
    // Exclude safe HTTP methods from verification
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    if (safeMethods.includes(req.method)) {
        return next();
    }

    // Optional: allow explicitly exempted paths (e.g., third-party webhooks)
    const exemptPaths = ['/api/webhooks'];
    if (exemptPaths.some(p => req.path.startsWith(p))) {
        return next();
    }

    // Extract CSRF token from common headers or body
    const token = req.headers['x-csrf-token'] || 
                  req.headers['csrf-token'] || 
                  req.headers['x-xsrf-token'] ||
                  req.body?._csrf;

    if (!token) {
        return res.status(403).json({
            success: false,
            code: 'CSRF_MISSING',
            message: 'Security validation failed: CSRF token is missing. Please refresh the page and try again.'
        });
    }

    if (!verifyCsrfToken(token)) {
        return res.status(403).json({
            success: false,
            code: 'CSRF_INVALID',
            message: 'Security validation failed: CSRF token is invalid or expired. Please refresh the page and try again.'
        });
    }

    // Token is valid — proceed to controller
    next();
}

/**
 * Route handler for GET /api/csrf-token
 * Generates and returns a fresh CSRF token and sets a Lax cookie.
 */
export function csrfTokenHandler(_req, res) {
    const token = generateCsrfToken();

    // Set a cookie so both header and cookie-based readers have access
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('sahyadri_csrf', token, {
        path: '/',
        httpOnly: false, // Accessible by frontend JS
        sameSite: 'lax',
        secure: isProd,
        maxAge: TOKEN_TTL_MS
    });

    // Also expose in response header
    res.setHeader('X-CSRF-Token', token);

    return res.json({
        success: true,
        csrfToken: token
    });
}
