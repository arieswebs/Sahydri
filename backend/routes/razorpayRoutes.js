import express from 'express';
import { 
    createRazorpayOrder, 
    verifyRazorpayPayment,
    getRazorpayConfig,
    updateRazorpayConfig,
    testRazorpayConnection
} from '../controllers/razorpayController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public checkout endpoints
router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);

// Admin gateway configuration endpoints
router.get('/config', requireAuth, requireAdmin, getRazorpayConfig);
router.post('/config', requireAuth, requireAdmin, updateRazorpayConfig);
router.post('/test', requireAuth, requireAdmin, testRazorpayConnection);

export default router;
