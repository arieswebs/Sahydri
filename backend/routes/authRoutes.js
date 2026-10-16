import express from 'express';
import rateLimit from 'express-rate-limit';
import {
    loginHandler, verifyOtpHandler, refreshHandler, logoutHandler, signupHandler,
    getMeHandler, updateProfileHandler, forgotPasswordHandler, resetPasswordHandler
} from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Strict rate limiting on auth endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 15,
    message: { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,  // 10 minutes
    max: 8,
    message: { success: false, message: 'Too many OTP attempts. Try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/login',           authLimiter, loginHandler);
router.post('/verify-otp',      otpLimiter,  verifyOtpHandler);
router.post('/refresh',         authLimiter, refreshHandler);
router.post('/logout',                       logoutHandler);
router.post('/signup',          authLimiter, signupHandler);
router.post('/forgot-password', authLimiter, forgotPasswordHandler);
router.post('/reset-password',  otpLimiter,  resetPasswordHandler);

// Profile endpoints (require authenticated session)
router.get('/me',           requireAuth, getMeHandler);
router.put('/profile',      requireAuth, updateProfileHandler);

export default router;
