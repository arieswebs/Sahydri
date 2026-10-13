// ─── Auth Controller: Login, OTP, Refresh, Profile (MySQL Powered) ─────────────
import bcrypt from 'bcryptjs';
import { users } from '../data/store.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendAdminOTP, verifyOTP } from '../utils/mailer.js';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeAddress } from '../utils/sanitize.js';
import { query, isDatabaseConnected } from '../config/db.js';

// In-memory refresh token allowlist
const validRefreshTokens = new Set();

// ── POST /api/auth/login ──────────────────────────────────────────────────────
export const loginHandler = async (req, res) => {
    const rawEmail = req.body?.email;
    const rawPassword = req.body?.password;

    const email = sanitizeEmail(rawEmail);
    const password = typeof rawPassword === 'string' ? rawPassword.trim() : '';

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Valid email and password are required.' });
    }

    // ── Admin path ────────────────────────────────────────────────────────────
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sahyadri.com').toLowerCase();
    if (email === adminEmail) {
        const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
        let passwordOk = false;

        if (hashFromEnv) {
            passwordOk = await bcrypt.compare(password, hashFromEnv);
        } else if (isDatabaseConnected()) {
            const adminRows = await query('SELECT password FROM users WHERE LOWER(email) = ? AND role = "admin"', [adminEmail]);
            if (adminRows.length > 0) {
                passwordOk = await bcrypt.compare(password, adminRows[0].password);
            }
        }

        if (!passwordOk) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Send OTP
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
            return res.status(500).json({ success: false, message: 'Failed to send OTP verification code.' });
        }
    }

    // ── Customer path (MySQL lookup) ──────────────────────────────────────────
    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM users WHERE LOWER(email) = ?', [email]);
            if (rows.length === 0) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const user = rows[0];
            let passwordOk = false;
            if (user.password && user.password.startsWith('$2')) {
                passwordOk = await bcrypt.compare(password, user.password);
            } else {
                passwordOk = password === user.password;
            }

            if (!passwordOk) {
                return res.status(401).json({ success: false, message: 'Invalid credentials.' });
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                address: user.address || ''
            };
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
        }
    } catch (err) {
        console.error('MySQL customer login error:', err.message);
    }

    // In-memory fallback
    const user = users.find(u => u.email.toLowerCase() === email && u.role !== 'admin');
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    let passwordOk = false;
    if (user.password && user.password.startsWith('$2')) {
        passwordOk = await bcrypt.compare(password, user.password);
    } else {
        passwordOk = password === user.password;
    }

    if (!passwordOk) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    }

    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || '',
        address: user.address || ''
    };
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
    const rawOtp = req.body?.otp;
    const otp = sanitizeString(rawOtp, 10);
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@sahyadri.com').toLowerCase();

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
export const refreshHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({ success: false, message: 'Refresh token required.' });
    }
    if (!validRefreshTokens.has(refreshToken)) {
        return res.status(401).json({ success: false, message: 'Refresh token revoked or invalid.' });
    }
    try {
        const decoded = verifyRefreshToken(refreshToken);

        let user = null;
        if (isDatabaseConnected()) {
            const rows = await query('SELECT id, name, email, role, phone, address FROM users WHERE id = ?', [decoded.id]);
            if (rows.length > 0) user = rows[0];
        }

        if (!user) {
            user = users.find(u => u.id === decoded.id) || { id: 'USR-001', role: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL };
        }

        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
        };
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
    const rawName = req.body?.name;
    const rawEmail = req.body?.email;
    const rawPassword = req.body?.password;

    const name = sanitizeString(rawName, 100);
    const email = sanitizeEmail(rawEmail);
    const password = typeof rawPassword === 'string' ? rawPassword : '';

    if (!name || !email || !password || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Name, valid email address, and password (at least 6 characters) are required.'
        });
    }

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT id FROM users WHERE LOWER(email) = ?', [email]);
            if (existing.length > 0) {
                return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const newUserId = `USR-${Date.now()}`;
            await query(`
                INSERT INTO users (id, name, email, password, role, phone, address)
                VALUES (?, ?, ?, ?, 'customer', '', '')
            `, [newUserId, name, email, hashedPassword]);

            const payload = {
                id: newUserId,
                name,
                email,
                role: 'customer',
                phone: '',
                address: ''
            };
            const accessToken  = signAccessToken(payload);
            const refreshToken = signRefreshToken({ id: newUserId });
            validRefreshTokens.add(refreshToken);

            return res.status(201).json({ success: true, accessToken, refreshToken, user: payload });
        }
    } catch (err) {
        console.error('MySQL signup error:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to create account in database.' });
    }

    // In-memory fallback
    if (users.some(u => u.email.toLowerCase() === email)) {
        return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = {
        id: `USR-${Date.now()}`,
        name,
        email,
        password: hashedPassword,
        role: 'customer',
        phone: '',
        address: ''
    };
    users.push(newUser);

    const payload = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address
    };
    const accessToken  = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: newUser.id });
    validRefreshTokens.add(refreshToken);

    return res.status(201).json({ success: true, accessToken, refreshToken, user: payload });
};

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
export const getMeHandler = async (req, res) => {
    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT id, name, email, role, phone, address FROM users WHERE id = ? OR LOWER(email) = ?', [
                req.user?.id || '',
                (req.user?.email || '').toLowerCase()
            ]);
            if (rows.length > 0) {
                return res.json({ success: true, user: rows[0] });
            }
        }
    } catch (err) {
        console.error('MySQL getMe error:', err.message);
    }

    const user = users.find(u => u.id === req.user?.id || u.email.toLowerCase() === req.user?.email?.toLowerCase());
    if (!user) {
        return res.status(404).json({ success: false, message: 'User profile not found.' });
    }
    return res.json({
        success: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '',
            address: user.address || ''
        }
    });
};

// ── PUT /api/auth/profile ─────────────────────────────────────────────────────
export const updateProfileHandler = async (req, res) => {
    const userId = req.user?.id || '';
    const userEmail = (req.user?.email || '').toLowerCase();
    const { name, phone, address } = req.body;

    const cleanName = name !== undefined ? sanitizeString(name, 100) : undefined;
    const cleanPhone = phone !== undefined ? sanitizePhone(phone) : undefined;
    const cleanAddress = address !== undefined ? sanitizeAddress(address, 300) : undefined;

    if (name !== undefined && !cleanName) {
        return res.status(400).json({ success: false, message: 'Name cannot be empty.' });
    }

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT * FROM users WHERE id = ? OR LOWER(email) = ?', [userId, userEmail]);
            if (existing.length === 0) {
                return res.status(404).json({ success: false, message: 'User account not found.' });
            }

            const current = existing[0];
            const updatedName = cleanName !== undefined ? cleanName : current.name;
            const updatedPhone = cleanPhone !== undefined ? cleanPhone : current.phone;
            const updatedAddress = cleanAddress !== undefined ? cleanAddress : current.address;

            await query(`
                UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?
            `, [updatedName, updatedPhone, updatedAddress, current.id]);

            const updatedUser = {
                id: current.id,
                name: updatedName,
                email: current.email,
                role: current.role,
                phone: updatedPhone || '',
                address: updatedAddress || ''
            };

            return res.json({
                success: true,
                message: 'Profile updated successfully.',
                user: updatedUser
            });
        }
    } catch (err) {
        console.error('MySQL updateProfile error:', err.message);
    }

    // In-memory fallback
    const userIndex = users.findIndex(u => u.id === userId || u.email.toLowerCase() === userEmail);
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    if (cleanName !== undefined) users[userIndex].name = cleanName;
    if (cleanPhone !== undefined) users[userIndex].phone = cleanPhone;
    if (cleanAddress !== undefined) users[userIndex].address = cleanAddress;

    const updatedUser = {
        id: users[userIndex].id,
        name: users[userIndex].name,
        email: users[userIndex].email,
        role: users[userIndex].role,
        phone: users[userIndex].phone || '',
        address: users[userIndex].address || ''
    };

    return res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: updatedUser
    });
};
