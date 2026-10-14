import crypto from 'crypto';
import { query, isDatabaseConnected } from '../config/db.js';

// In-memory cache for Razorpay configuration
let memoryConfig = {
    keyId: process.env.RAZORPAY_KEY_ID || '',
    keySecret: process.env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || '',
    mode: process.env.RAZORPAY_MODE || 'test',
    enabled: true,
};

/**
 * Fetch active Razorpay credentials dynamically (DB -> Memory -> .env)
 */
async function getActiveCredentials() {
    try {
        if (isDatabaseConnected()) {
            const rows = await query("SELECT key_name, key_value FROM store_settings WHERE key_name LIKE 'razorpay_%'");
            if (rows && rows.length > 0) {
                const map = {};
                rows.forEach(r => { map[r.key_name] = r.key_value; });
                if (map['razorpay_key_id'] && map['razorpay_key_id'].trim() !== '') memoryConfig.keyId = map['razorpay_key_id'].trim();
                if (map['razorpay_key_secret'] && map['razorpay_key_secret'].trim() !== '') memoryConfig.keySecret = map['razorpay_key_secret'].trim();
                if (map['razorpay_webhook_secret'] !== undefined) memoryConfig.webhookSecret = map['razorpay_webhook_secret'];
                if (map['razorpay_mode'] && map['razorpay_mode'].trim() !== '') memoryConfig.mode = map['razorpay_mode'];
                if (map['razorpay_enabled'] !== undefined) memoryConfig.enabled = map['razorpay_enabled'] === '1' || map['razorpay_enabled'] === 'true';
            }
        }
    } catch {
        // Fallback to in-memory config
    }

    const keyId = memoryConfig.keyId || process.env.RAZORPAY_KEY_ID || '';
    const keySecret = memoryConfig.keySecret || process.env.RAZORPAY_KEY_SECRET || '';
    const isConfigured = Boolean(keyId && keySecret && !keyId.includes('YOUR_KEY_ID') && !keySecret.includes('YOUR_KEY_SECRET'));

    return {
        keyId,
        keySecret,
        webhookSecret: memoryConfig.webhookSecret,
        mode: memoryConfig.mode,
        enabled: memoryConfig.enabled,
        isConfigured
    };
}

// Helper: call the Razorpay REST API (no external SDK dependency needed)
async function razorpayRequest(endpoint, body, overrideCreds = null) {
    const creds = overrideCreds || await getActiveCredentials();
    const token = Buffer.from(`${creds.keyId}:${creds.keySecret}`).toString('base64');
    const response = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${token}`,
        },
        body: JSON.stringify(body),
    });
    return response.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/razorpay/config (Admin Only)
// ─────────────────────────────────────────────────────────────────────────────
export const getRazorpayConfig = async (_req, res) => {
    try {
        const creds = await getActiveCredentials();
        const maskedSecret = creds.keySecret ? `${creds.keySecret.substring(0, 4)}••••••••${creds.keySecret.slice(-4)}` : '';

        return res.json({
            success: true,
            data: {
                keyId: creds.keyId,
                keySecretMasked: maskedSecret,
                hasKeySecret: Boolean(creds.keySecret),
                webhookSecret: creds.webhookSecret,
                mode: creds.mode,
                enabled: creds.enabled,
                isConfigured: creds.isConfigured
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Could not load Razorpay configuration' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay/config (Admin Only)
// Body: { keyId, keySecret, webhookSecret, mode, enabled }
// ─────────────────────────────────────────────────────────────────────────────
export const updateRazorpayConfig = async (req, res) => {
    try {
        const { keyId, keySecret, webhookSecret, mode, enabled } = req.body;

        if (keyId !== undefined) memoryConfig.keyId = String(keyId).trim();
        if (keySecret !== undefined && String(keySecret).trim() !== '' && !String(keySecret).includes('••••')) {
            memoryConfig.keySecret = String(keySecret).trim();
        }
        if (webhookSecret !== undefined) memoryConfig.webhookSecret = String(webhookSecret).trim();
        if (mode !== undefined) memoryConfig.mode = mode === 'live' ? 'live' : 'test';
        if (enabled !== undefined) memoryConfig.enabled = Boolean(enabled);

        // Persist to MySQL store_settings
        if (isDatabaseConnected()) {
            const updates = [
                ['razorpay_key_id', memoryConfig.keyId],
                ['razorpay_key_secret', memoryConfig.keySecret],
                ['razorpay_webhook_secret', memoryConfig.webhookSecret],
                ['razorpay_mode', memoryConfig.mode],
                ['razorpay_enabled', memoryConfig.enabled ? '1' : '0'],
            ];

            for (const [k, v] of updates) {
                await query(`
                    INSERT INTO store_settings (key_name, key_value)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE key_value = VALUES(key_value)
                `, [k, v]);
            }
        }

        const creds = await getActiveCredentials();
        return res.json({
            success: true,
            message: 'Razorpay configuration saved successfully!',
            data: {
                keyId: creds.keyId,
                mode: creds.mode,
                enabled: creds.enabled,
                isConfigured: creds.isConfigured
            }
        });
    } catch (err) {
        console.error('Error updating Razorpay config:', err);
        return res.status(500).json({ success: false, message: 'Failed to save Razorpay settings.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay/test (Admin Only)
// Body: { keyId, keySecret } (optional: test current or new)
// ─────────────────────────────────────────────────────────────────────────────
export const testRazorpayConnection = async (req, res) => {
    try {
        let keyId = req.body?.keyId;
        let keySecret = req.body?.keySecret;

        if (!keyId || !keySecret || keySecret.includes('••••')) {
            const current = await getActiveCredentials();
            keyId = keyId || current.keyId;
            keySecret = (keySecret && !keySecret.includes('••••')) ? keySecret : current.keySecret;
        }

        if (!keyId || !keySecret) {
            return res.status(400).json({
                success: false,
                message: 'Please provide both Razorpay Key ID and Key Secret to test.'
            });
        }

        // Test credentials by querying Razorpay API with Basic Auth
        const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const apiRes = await fetch('https://api.razorpay.com/v1/payments?count=1', {
            method: 'GET',
            headers: { 'Authorization': `Basic ${token}` }
        });

        const data = await apiRes.json();

        if (apiRes.status === 401 || data.error) {
            return res.status(400).json({
                success: false,
                message: data.error?.description || 'Invalid Razorpay Key ID or Key Secret.'
            });
        }

        return res.json({
            success: true,
            message: '✅ Razorpay API connection verified successfully! Credentials are active.'
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Connection test failed: ' + err.message });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay/create-order
// Body: { amount, currency, receipt, notes }
// ─────────────────────────────────────────────────────────────────────────────
export const createRazorpayOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt, notes = {} } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Valid amount (in paise) is required.' });
        }

        const creds = await getActiveCredentials();

        // If gateway not configured or test fallback active
        if (!creds.isConfigured || !creds.enabled) {
            const fakeOrderId = `order_sandbox_${Date.now()}`;
            return res.json({
                success: true,
                orderId: fakeOrderId,
                amount: Math.round(Number(amount)),
                currency,
                keyId: creds.keyId || 'rzp_test_sahydri_sandbox',
                sandbox: true,
                message: !creds.enabled ? 'Payments currently in sandbox/demo mode' : 'Gateway in dev test mode'
            });
        }

        const order = await razorpayRequest('/orders', {
            amount: Math.round(Number(amount)), // amount in paise
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes,
        }, creds);

        if (order.error) {
            console.error('Razorpay error:', order.error);
            return res.status(402).json({ success: false, message: order.error.description, razorpayError: order.error });
        }

        return res.json({
            success: true,
            orderId: order.id,
            amount:  order.amount,
            currency: order.currency,
            keyId: creds.keyId,
        });
    } catch (err) {
        console.error('createRazorpayOrder error:', err);
        return res.status(500).json({ success: false, message: 'Payment gateway unreachable.' });
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/razorpay/verify
// Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// ─────────────────────────────────────────────────────────────────────────────
export const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
        }

        const creds = await getActiveCredentials();

        if (razorpay_order_id.startsWith('order_sandbox_') || !creds.isConfigured) {
            return res.json({ success: true, message: 'Sandbox payment verified.', paymentId: razorpay_payment_id });
        }

        const expectedSignature = crypto
            .createHmac('sha256', creds.keySecret)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest('hex');

        const isValid = expectedSignature === razorpay_signature;

        if (!isValid) {
            return res.status(400).json({ success: false, message: 'Payment signature mismatch. Possible tampering detected.' });
        }

        return res.json({ success: true, message: 'Payment verified successfully.', paymentId: razorpay_payment_id });
    } catch (err) {
        console.error('verifyRazorpayPayment error:', err);
        return res.status(500).json({ success: false, message: 'Verification failed.' });
    }
};
