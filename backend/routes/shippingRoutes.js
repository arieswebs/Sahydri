import express from 'express';
import { getShipwayCredentials, pushOrderToShipway, getShipwayTrackingUrl } from '../utils/shipway.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/shipping/status
 * Public or admin verification of Shipway connectivity
 */
router.get('/status', (_req, res) => {
    const { username, licenseKey } = getShipwayCredentials();
    const isConfigured = Boolean(username && licenseKey);

    res.json({
        success: true,
        provider: 'Shipway',
        connected: isConfigured,
        account: username ? `${username.slice(0, 4)}***@${username.split('@')[1] || 'gmail.com'}` : null,
        fullAccount: username,
        carrierPartners: ['Delhivery', 'BlueDart', 'XpressBees', 'DTDC', 'Shadowfax'],
        features: ['Automated WISMO SMS & WhatsApp', 'Real-time Webhook Sync', 'NDR Management']
    });
});

/**
 * POST /api/shipping/push-order
 * Push order details to Shipway
 */
router.post('/push-order', async (req, res) => {
    const order = req.body;
    if (!order || !order.id) {
        return res.status(400).json({ success: false, message: 'Valid order details required' });
    }

    const result = await pushOrderToShipway(order);
    res.json(result);
});

/**
 * GET /api/shipping/track/:orderId
 * Retrieve tracking link and details for a customer order
 */
router.get('/track/:orderId', (req, res) => {
    const { orderId } = req.params;
    if (!orderId) {
        return res.status(400).json({ success: false, message: 'Order ID is required' });
    }

    const trackingUrl = getShipwayTrackingUrl(orderId);
    res.json({
        success: true,
        orderId,
        trackingUrl,
        courier: 'Shipway Multi-Carrier Network',
        message: 'Live tracking powered by Shipway'
    });
});

export default router;
