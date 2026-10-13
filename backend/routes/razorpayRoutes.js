import express from 'express';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/razorpayController.js';

const router = express.Router();

// POST /api/razorpay/create-order  →  creates a Razorpay order
router.post('/create-order', createRazorpayOrder);

// POST /api/razorpay/verify  →  verifies signature after payment
router.post('/verify', verifyRazorpayPayment);

export default router;
