// ─── Input Sanitization & Validation Utilities ──────────────────────────────

/**
 * Escapes HTML characters to prevent XSS / markup injection
 */
export function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Strips script tags, HTML tags, and null bytes; trims and truncates
 */
export function sanitizeString(val, maxLength = 255) {
    if (val === null || val === undefined) return '';
    let cleaned = String(val)
        .replace(/\0/g, '') // remove null bytes
        .replace(/<[^>]*>?/gm, '') // strip HTML tags
        .trim();
    if (maxLength && cleaned.length > maxLength) {
        cleaned = cleaned.slice(0, maxLength);
    }
    return cleaned;
}

/**
 * Validates and normalizes email addresses
 */
export function sanitizeEmail(email) {
    if (!email || typeof email !== 'string') return null;
    const trimmed = email.trim().toLowerCase();
    // RFC 5322 compliant regex for practical email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (trimmed.length > 254 || !emailRegex.test(trimmed)) {
        return null;
    }
    return trimmed;
}

/**
 * Sanitizes phone numbers, keeping only valid digits and telephone punctuation
 */
export function sanitizePhone(phone) {
    if (!phone || typeof phone !== 'string') return '';
    const cleaned = phone.replace(/[^0-9+\s\-()]/g, '').trim();
    return cleaned.slice(0, 20);
}

/**
 * Validates and bounds a numeric input
 */
export function sanitizeNumber(val, defaultVal = 0, min = 0, max = Infinity) {
    const num = Number(val);
    if (isNaN(num) || !isFinite(num)) return defaultVal;
    return Math.min(Math.max(num, min), max);
}

/**
 * Sanitizes postal or physical shipping address
 */
export function sanitizeAddress(addr, maxLength = 300) {
    return sanitizeString(addr, maxLength);
}
