// ─── Auth Controller: Login, OTP, Refresh ─────────────────────────────────────
import bcrypt from 'bcryptjs';
import { users } from '../data/store.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendAdminOTP, verifyOTP } from '../utils/mailer.js';

// In-memory refresh token allowlist (replace with Redis in production)
const validRefreshTokens = new Set();

// ── POST /api/auth/login ──────────────────────────────────────────────────────
// Customer login → issues JWT immediately
// Admin login → sends OTP, does NOT issue JWT yet
export const loginHandler = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // ── Admin path ────────────────────────────────────────────────────────────
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sahyadri.com';
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
        const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
        if (!hashFromEnv) {
            return res.status(500).json({ success: false, message: 'Admin not configured.' });
        }

        const passwordOk = await bcrypt.compare(password, hashFromEnv);
        if (!passwordOk) {
            // Generic message to prevent email enumeration
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Password is correct → send OTP
        try {
            const result = await sendAdminOTP(adminEmail);
            return res.json({
                success: true,
                requiresOtp: true,
                devMode: result.devMode,
                message: result.devMode
                    ? 'OTP printed in backend console (dev mode — configure GMAIL_USER to send email).'
                    : `OTP sent to ${adminEmail.replace(/(.{2}).*@/, '$1***@')}`,
            });
        } catch (err) {
            console.error('OTP send error:', err);
            return res.status(500).json({ success: false, message: 'Failed to send OTP. Check Gmail config.' });
        }
    }

    // ── Customer path ─────────────────────────────────────────────────────────
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.role !== 'admin');
    if (!user) {
        // Don't reveal whether the email exists
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    // Support both plain-text (legacy) and bcrypt passwords
    let passwordOk = false;
    if (user.password.startsWith('$2')) {
        passwordOk = await bcrypt.compare(password, user.password);
    } else {
        passwordOk = password === user.password;
    }

    if (!passwordOk) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user.id });
    validRefreshTokens.add(refreshToken);

    return res.json({
        success: true,
        requiresOtp: false,
        accessToken,
        refreshToken,
        user: payload,
    });
};

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
export const verifyOtpHandler = (req, res) => {
    const { otp } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sahyadri.com';

    if (!otp) {
        return res.status(400).json({ success: false, message: 'OTP is required.' });
    }

    const result = verifyOTP(adminEmail, otp);
    if (!result.valid) {
        return res.status(401).json({ success: false, message: result.reason });
    }

    const payload = { id: 'USR-001', name: 'Admin Sahyadri', email: adminEmail, role: 'admin' };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: 'USR-001' });
    validRefreshTokens.add(refreshToken);

    return res.json({
        success: true,
        accessToken,
        refreshToken,
        user: payload,
    });
};

// ── POST /api/auth/refresh ────────────────────────────────────────────────────
export const refreshHandler = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token required.' });
    }
    if (!validRefreshTokens.has(refreshToken)) {
        return res.status(401).json({ success: false, message: 'Refresh token revoked or invalid.' });
    }
    try {
        const decoded = verifyRefreshToken(refreshToken);
        const user    = users.find(u => u.id === decoded.id) || { id: 'USR-001', role: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL };
        const payload = { id: user.id, name: user.name, email: user.email, role: user.role };
        const newAccessToken = signAccessToken(payload);
        return res.json({ success: true, accessToken: newAccessToken });
    } catch {
        return res.status(401).json({ success: false, message: 'Invalid or expired refresh token.' });
    }
};

// ── POST /api/auth/logout ─────────────────────────────────────────────────────
export const logoutHandler = (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) validRefreshTokens.delete(refreshToken);
    return res.json({ success: true, message: 'Logged out successfully.' });
};

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
export const signupHandler = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name?.trim() || !email?.includes('@') || !password || password.length < 6) {
        return res.status(400).json({ success: false, message: 'Name, valid email, and password (≥6 chars) are required.' });
    }
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
        id:    `USR-${Date.now()}`,
        name:  name.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'customer',
    };
    users.push(newUser);

    const payload = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: newUser.id });
    validRefreshTokens.add(refreshToken);

    return res.status(201).json({ success: true, accessToken, refreshToken, user: payload });
};
