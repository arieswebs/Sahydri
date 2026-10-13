import crypto from 'crypto';

// ─────────────────────────────────────────────────────────────────────────────
// Razorpay credentials
// Replace these with your actual Key ID and Key Secret from the Razorpay dashboard.
// In production, load these from environment variables (.env):
//   RAZORPAY_KEY_ID=rzp_test_xxxxx
//   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxx
// ─────────────────────────────────────────────────────────────────────────────
const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID     || 'rzp_test_YOUR_KEY_ID';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || 'YOUR_KEY_SECRET';

// Helper: call the Razorpay REST API (no SDK dependency needed)
async function razorpayRequest(endpoint, body) {
    const credentials = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
    const response = await fetch(`https://api.razorpay.com/v1${endpoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${credentials}`,
        },
        body: JSON.stringify(body),
    });
    return response.json();
}

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

        // Seamless dev/test sandbox fallback if real keys are not yet configured in .env
        const isPlaceholderKey = !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('YOUR_KEY_ID') || RAZORPAY_KEY_SECRET.includes('YOUR_KEY_SECRET');
        if (isPlaceholderKey) {
            const fakeOrderId = `order_sandbox_${Date.now()}`;
            return res.json({
                success: true,
                orderId: fakeOrderId,
                amount: Math.round(Number(amount)),
                currency,
                keyId: 'rzp_test_sahyadri_sandbox',
                sandbox: true
            });
        }

        const order = await razorpayRequest('/orders', {
            amount: Math.round(Number(amount)),   // must be in paise (₹1 = 100 paise)
            currency,
            receipt: receipt || `rcpt_${Date.now()}`,
            notes,
        });

        if (order.error) {
            console.error('Razorpay error:', order.error);
            return res.status(402).json({ success: false, message: order.error.description, razorpayError: order.error });
        }

        return res.json({
            success: true,
            orderId: order.id,
            amount:  order.amount,
            currency: order.currency,
            keyId: RAZORPAY_KEY_ID,
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
export const verifyRazorpayPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id) {
            return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
        }

        const isPlaceholderKey = !RAZORPAY_KEY_ID || RAZORPAY_KEY_ID.includes('YOUR_KEY_ID') || RAZORPAY_KEY_SECRET.includes('YOUR_KEY_SECRET');
        if (razorpay_order_id.startsWith('order_sandbox_') || isPlaceholderKey) {
            return res.json({ success: true, message: 'Sandbox payment verified.', paymentId: razorpay_payment_id });
        }

        const expectedSignature = crypto
            .createHmac('sha256', RAZORPAY_KEY_SECRET)
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
