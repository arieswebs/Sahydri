/**
 * CSRF Protection Service for Sahydri Organics
 * Handles fetching, caching, refreshing, and attaching cryptographically secure CSRF tokens.
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || 'http://localhost:5000/api';
let cachedCsrfToken = null;
let pendingFetchPromise = null;

/**
 * Read CSRF token from memory, sessionStorage, or localStorage
 */
export function getStoredCsrfToken() {
    if (cachedCsrfToken) return cachedCsrfToken;
    try {
        const stored = sessionStorage.getItem('sahyadri_csrf_token') || localStorage.getItem('sahyadri_csrf_token');
        if (stored) {
            cachedCsrfToken = stored;
            return stored;
        }
    } catch {
        /* storage restricted */
    }
    return null;
}

/**
 * Fetch a fresh CSRF token from the server
 */
export async function fetchCsrfToken() {
    if (pendingFetchPromise) return pendingFetchPromise;

    pendingFetchPromise = (async () => {
        try {
            const res = await fetch(`${API_BASE}/csrf-token`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
            });

            if (res.ok) {
                const data = await res.json();
                const token = data.csrfToken || res.headers.get('X-CSRF-Token');
                if (token) {
                    cachedCsrfToken = token;
                    try {
                        sessionStorage.setItem('sahyadri_csrf_token', token);
                        localStorage.setItem('sahyadri_csrf_token', token);
                    } catch {}
                    return token;
                }
            }
        } catch (err) {
            console.warn('[CSRF Service] Failed to retrieve CSRF token:', err.message);
        } finally {
            pendingFetchPromise = null;
        }
        return cachedCsrfToken;
    })();

    return pendingFetchPromise;
}

/**
 * Get an active CSRF token, fetching one if not currently present
 */
export async function getCsrfToken() {
    const existing = getStoredCsrfToken();
    if (existing) return existing;
    return await fetchCsrfToken();
}

/**
 * Clear the CSRF token cache (e.g. on logout or invalidation)
 */
export function clearCsrfToken() {
    cachedCsrfToken = null;
    try {
        sessionStorage.removeItem('sahyadri_csrf_token');
        localStorage.removeItem('sahyadri_csrf_token');
    } catch {}
}

/**
 * Mutating HTTP methods requiring CSRF validation
 */
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * Secure fetch wrapper that automatically attaches the CSRF token to mutating requests
 * and retries once if the token was expired or invalidated.
 */
export async function secureFetch(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const isMutating = MUTATING_METHODS.has(method);

    let headers = { ...(options.headers || {}) };

    if (isMutating) {
        let token = await getCsrfToken();
        if (token) {
            headers['X-CSRF-Token'] = token;
        }
    }

    let response = await fetch(url, { ...options, headers });

    // Update token if server rotated it in response headers
    const newHeaderToken = response.headers.get('X-CSRF-Token');
    if (newHeaderToken) {
        cachedCsrfToken = newHeaderToken;
        try { 
            sessionStorage.setItem('sahyadri_csrf_token', newHeaderToken);
            localStorage.setItem('sahyadri_csrf_token', newHeaderToken);
        } catch {}
    }

    // Auto-retry once on CSRF error (expired or invalid token)
    if (response.status === 403 && isMutating) {
        try {
            const cloned = response.clone();
            const errData = await cloned.json();
            if (errData && (errData.code === 'CSRF_INVALID' || errData.code === 'CSRF_MISSING')) {
                console.warn('[CSRF Service] Token expired/invalid. Refreshing and retrying...');
                clearCsrfToken();
                const freshToken = await fetchCsrfToken();
                if (freshToken) {
                    headers['X-CSRF-Token'] = freshToken;
                    response = await fetch(url, { ...options, headers });
                }
            }
        } catch {
            // Not a JSON error body; return original response
        }
    }

    return response;
}
