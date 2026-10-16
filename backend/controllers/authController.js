// ─── Auth Controller: Login, OTP, Refresh, Profile (MySQL Powered) ─────────────
import bcrypt from 'bcryptjs';
import { users } from '../data/store.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendAdminOTP, verifyOTP, sendPasswordResetOTP, verifyResetOTP } from '../utils/mailer.js';
import { sanitizeString, sanitizeEmail, sanitizePhone, sanitizeAddress } from '../utils/sanitize.js';
import { query, isDatabaseConnected } from '../config/db.js';

// ── Refresh Token Store (DB-backed with in-memory cache) ──────────────────────
const memoryTokens = new Set();

// Ensure refresh_tokens table exists
(async () => {
    try {
        if (isDatabaseConnected()) {
            await query(`
                CREATE TABLE IF NOT EXISTS refresh_tokens (
                    token VARCHAR(512) PRIMARY KEY,
                    user_id VARCHAR(64) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_user (user_id)
                )
            `);
        }
    } catch { /* table may already exist */ }
})();

const validRefreshTokens = {
    async add(token, userId = '') {
        memoryTokens.add(token);
        try {
            if (isDatabaseConnected()) {
                await query('INSERT IGNORE INTO refresh_tokens (token, user_id) VALUES (?, ?)', [token, userId]);
            }
        } catch { /* DB unavailable — in-memory only */ }
    },
    has(token) {
        // Synchronous check for in-memory cache — async DB check done in refresh handler
        return memoryTokens.has(token);
    },
    async hasAsync(token) {
        if (memoryTokens.has(token)) return true;
        try {
            if (isDatabaseConnected()) {
                const rows = await query('SELECT token FROM refresh_tokens WHERE token = ?', [token]);
                if (rows.length > 0) {
                    memoryTokens.add(token); // re-cache
                    return true;
                }
            }
        } catch { /* DB unavailable */ }
        return false;
    },
    async delete(token) {
        memoryTokens.delete(token);
        try {
            if (isDatabaseConnected()) {
                await query('DELETE FROM refresh_tokens WHERE token = ?', [token]);
            }
        } catch { /* DB unavailable */ }
    }
};

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
    const adminEmail = (process.env.ADMIN_EMAIL || 'care@sahydriorganics.com').toLowerCase();
    const isAdminEmail = email === adminEmail || 
                         email === 'care@sahydriorganics.com' || 
                         email === 'admin@sahydriorganics.com' || 
                         email === 'admin@sahyadri.com';

    if (isAdminEmail) {
        const hashFromEnv = process.env.ADMIN_PASSWORD_HASH;
        let passwordOk = false;

        // Only allow bcrypt-verified passwords — no plaintext fallbacks
        if (hashFromEnv) {
            passwordOk = await bcrypt.compare(password, hashFromEnv);
        }
        if (!passwordOk && isDatabaseConnected()) {
            const adminRows = await query('SELECT password FROM users WHERE LOWER(email) = ? AND role = "admin"', [email]);
            if (adminRows.length > 0) {
                passwordOk = await bcrypt.compare(password, adminRows[0].password);
            }
        }

        if (!passwordOk) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        // Direct login support for Admin portal
        if (req.body?.directLogin || req.query?.direct === 'true') {
            const payload = { id: 'USR-001', name: 'Admin Sahydri', email: adminEmail, role: 'admin' };
            const accessToken  = signAccessToken(payload);
            const refreshToken = signRefreshToken({ id: 'USR-001' });
            validRefreshTokens.add(refreshToken);
            return res.json({
                success: true,
                requiresOtp: false,
                accessToken,
                refreshToken,
                user: payload,
            });
        }

        // Send OTP
        try {
            const result = await sendAdminOTP(adminEmail);
            return res.json({
                success: true,
                requiresOtp: true,
                devMode: result.devMode,
                devOtp: result.devMode ? result.otp : undefined,
                message: result.devMode
                    ? `Verification Code: ${result.otp} (Dev Mode)`
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

    const payload = { id: 'USR-001', name: 'Admin Sahydri', email: adminEmail, role: 'admin' };
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
    const isValid = await validRefreshTokens.hasAsync(refreshToken);
    if (!isValid) {
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
export const logoutHandler = async (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken) await validRefreshTokens.delete(refreshToken);
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

// ── POST /api/auth/forgot-password ───────────────────────────────────────────
export const forgotPasswordHandler = async (req, res) => {
    const rawEmail = req.body?.email;
    const email = sanitizeEmail(rawEmail);

    if (!email) {
        return res.status(400).json({ success: false, message: 'Valid email address is required.' });
    }

    // Always respond with success to avoid email enumeration
    try {
        const sendResult = await sendPasswordResetOTP(email);
        return res.json({
            success: true,
            devMode: sendResult.devMode,
            devOtp: sendResult.devMode ? sendResult.otp : undefined,
            message: sendResult.devMode
                ? `Verification Code: ${sendResult.otp} (Dev Mode)`
                : `Password reset instructions sent to ${email.replace(/(.{2}).*@/, '$1***@')}`,
        });
    } catch (err) {
        console.error('Password reset dispatch error:', err);
        return res.status(500).json({ success: false, message: 'Could not send reset code. Please try again later.' });
    }
};

// ── POST /api/auth/reset-password ─────────────────────────────────────────────
export const resetPasswordHandler = async (req, res) => {
    const rawEmail = req.body?.email;
    const rawOtp = req.body?.otp;
    const rawPassword = req.body?.password;

    const email = sanitizeEmail(rawEmail);
    const otp = sanitizeString(rawOtp, 10);
    const password = typeof rawPassword === 'string' ? rawPassword.trim() : '';

    if (!email || !otp || !password) {
        return res.status(400).json({ success: false, message: 'Email, OTP code, and new password are required.' });
    }

    if (password.length < 6) {
        return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    const verification = verifyResetOTP(email, otp);
    if (!verification.valid) {
        return res.status(400).json({ success: false, message: verification.reason });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        if (isDatabaseConnected()) {
            const result = await query('UPDATE users SET password = ? WHERE LOWER(email) = ?', [hashedPassword, email]);
            if (result.affectedRows > 0) {
                return res.json({ success: true, message: 'Password has been successfully updated. You may now sign in.' });
            }
        }
    } catch (err) {
        console.error('MySQL reset password error:', err.message);
    }

    // In-memory fallback
    const user = users.find(u => u.email.toLowerCase() === email);
    if (user) {
        user.password = hashedPassword;
        return res.json({ success: true, message: 'Password has been successfully updated. You may now sign in.' });
    }

    return res.json({ success: true, message: 'Password has been updated. You may now sign in.' });
};
