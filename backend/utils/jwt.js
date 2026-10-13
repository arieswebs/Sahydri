// ─── JWT Utilities ────────────────────────────────────────────────────────────
import jwt from 'jsonwebtoken';

const SECRET         = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const EXPIRES_IN     = process.env.JWT_EXPIRES_IN     || '15m';
const REFRESH_EXP    = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

if (!SECRET || !REFRESH_SECRET) {
    throw new Error('JWT_SECRET and JWT_REFRESH_SECRET must be set in .env');
}

export const signAccessToken = (payload) =>
    jwt.sign(payload, SECRET, { expiresIn: EXPIRES_IN, algorithm: 'HS256' });

export const signRefreshToken = (payload) =>
    jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXP, algorithm: 'HS256' });

export const verifyAccessToken = (token) =>
    jwt.verify(token, SECRET, { algorithms: ['HS256'] });

export const verifyRefreshToken = (token) =>
    jwt.verify(token, REFRESH_SECRET, { algorithms: ['HS256'] });
