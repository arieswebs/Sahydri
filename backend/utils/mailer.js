// ─── Nodemailer OTP Sender ────────────────────────────────────────────────────
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// In-memory OTP store: { email -> { otp, expiresAt, attempts } }
const otpStore = new Map();

const OTP_EXPIRES_MS = (parseInt(process.env.OTP_EXPIRES_MINUTES) || 10) * 60 * 1000;
const MAX_ATTEMPTS   = 5;

// Create transporter (Gmail SMTP with App Password)
const createTransporter = () => nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Generate a 6-digit numeric OTP
export const generateOTP = () => String(Math.floor(100000 + crypto.randomInt(900000)));

// Store OTP and send via email
export const sendAdminOTP = async (email) => {
    const otp = generateOTP();
    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + OTP_EXPIRES_MS,
        attempts:  0,
    });

    // If Gmail is not configured, log to console (dev mode)
    if (!process.env.GMAIL_USER || process.env.GMAIL_USER === 'your_gmail@gmail.com') {
        console.log(`\n⚡ [DEV MODE] Admin OTP for ${email}: ${otp}  (expires in ${process.env.OTP_EXPIRES_MINUTES || 10} mins)\n`);
        return { success: true, devMode: true };
    }

    const transporter = createTransporter();
    const html = `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;border:1px solid #d4af37;border-radius:12px;overflow:hidden">
          <div style="background:#0b251d;padding:28px 32px;text-align:center">
            <h1 style="color:#d4af37;margin:0;font-size:1.3rem;letter-spacing:0.12em">SAHYADRI NATURALS</h1>
            <p style="color:rgba(212,175,55,0.6);font-size:0.75rem;margin:4px 0 0;letter-spacing:0.2em">ADMIN CONSOLE</p>
          </div>
          <div style="padding:36px 32px;background:#faf8f4">
            <h2 style="color:#0b251d;font-size:1.1rem;margin-bottom:8px">Your Admin Login OTP</h2>
            <p style="color:#5a4e3c;font-size:0.9rem;line-height:1.6">
              A login attempt was made for the Sahyadri Admin Console. Use the OTP below to complete your sign-in.
            </p>
            <div style="text-align:center;margin:28px 0">
              <div style="display:inline-block;background:#0b251d;color:#d4af37;font-size:2.4rem;font-weight:800;letter-spacing:0.3em;padding:18px 36px;border-radius:10px;font-family:monospace">
                ${otp}
              </div>
            </div>
            <p style="color:#9e8550;font-size:0.8rem;text-align:center">
              This OTP expires in <strong>${process.env.OTP_EXPIRES_MINUTES || 10} minutes</strong>.<br/>
              If you did not request this, ignore this email and change your password immediately.
            </p>
          </div>
          <div style="background:#f3ede0;padding:14px 32px;text-align:center">
            <p style="color:#a39580;font-size:0.72rem;margin:0">© 2026 Sahyadri Naturals. Do not share this OTP with anyone.</p>
          </div>
        </div>
    `;

    await transporter.sendMail({
        from:    `"Sahyadri Admin" <${process.env.GMAIL_USER}>`,
        to:      email,
        subject: '🔐 Your Admin OTP – Sahyadri Console',
        html,
    });

    return { success: true, devMode: false };
};

// Verify OTP — returns true/false, tracks attempts
export const verifyOTP = (email, inputOtp) => {
    const record = otpStore.get(email);
    if (!record) return { valid: false, reason: 'No OTP found. Please request a new one.' };
    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        return { valid: false, reason: 'OTP has expired. Please request a new one.' };
    }
    record.attempts += 1;
    if (record.attempts > MAX_ATTEMPTS) {
        otpStore.delete(email);
        return { valid: false, reason: 'Too many attempts. Please request a new OTP.' };
    }
    if (record.otp !== inputOtp.trim()) {
        return { valid: false, reason: `Invalid OTP. ${MAX_ATTEMPTS - record.attempts} attempts remaining.` };
    }
    otpStore.delete(email);  // one-time use
    return { valid: true };
};
