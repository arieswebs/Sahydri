import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const backendUploadDir = path.join(__dirname, '..', 'uploads', 'products');
if (!fs.existsSync(backendUploadDir)) {
    fs.mkdirSync(backendUploadDir, { recursive: true });
}

// Optional sync directory (Vite public/images/products)
const frontendUploadDir = path.join(__dirname, '..', '..', 'public', 'images', 'products');
if (!fs.existsSync(frontendUploadDir)) {
    try { fs.mkdirSync(frontendUploadDir, { recursive: true }); } catch { /* ignore */ }
}

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, backendUploadDir);
    },
    filename: (_req, file, cb) => {
        const cleanOriginal = file.originalname
            .toLowerCase()
            .replace(/[^a-z0-9.]/g, '-')
            .replace(/-+/g, '-');
        const ext = path.extname(cleanOriginal) || '.jpg';
        const base = path.basename(cleanOriginal, ext).slice(0, 30);
        const uniqueName = `prod-${Date.now()}-${base}${ext}`;
        cb(null, uniqueName);
    }
});

// File filter: images only
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, WEBP, and AVIF image files are allowed.'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Helper: sync file to frontend public directory if available
function syncToFrontend(filename, sourcePath) {
    if (fs.existsSync(frontendUploadDir)) {
        try {
            const destPath = path.join(frontendUploadDir, filename);
            fs.copyFileSync(sourcePath, destPath);
        } catch (err) {
            console.warn('[Upload Sync Warning]', err.message);
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload/product-photos (Multiple Multipart Form Data)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/product-photos', requireAuth, requireAdmin, (req, res) => {
    upload.array('photos', 15)(req, res, (err) => {
        if (err) {
            console.error('Multer multiple upload error:', err.message);
            return res.status(400).json({ success: false, message: err.message });
        }

        const files = req.files || [];
        if (files.length === 0) {
            return res.status(400).json({ success: false, message: 'No image files uploaded.' });
        }

        const urls = [];
        const fileDetails = [];

        for (const file of files) {
            const filename = file.filename;
            const sourcePath = file.path;
            syncToFrontend(filename, sourcePath);
            const imageUrl = `/images/products/${filename}`;
            urls.push(imageUrl);
            fileDetails.push({
                url: imageUrl,
                filename: filename,
                size: file.size,
                mimetype: file.mimetype
            });
        }

        return res.json({
            success: true,
            message: `${files.length} product photo(s) uploaded successfully!`,
            urls: urls,
            files: fileDetails
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload/product-photo (Single Multipart Form Data - Backwards Compatibility)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/product-photo', requireAuth, requireAdmin, (req, res) => {
    upload.single('photo')(req, res, (err) => {
        if (err) {
            console.error('Multer upload error:', err.message);
            return res.status(400).json({ success: false, message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image file uploaded.' });
        }

        const filename = req.file.filename;
        const sourcePath = req.file.path;

        // Copy to public folder for direct frontend access
        syncToFrontend(filename, sourcePath);

        // Standardized relative path for store catalog
        const imageUrl = `/images/products/${filename}`;

        return res.json({
            success: true,
            message: 'Product photo uploaded successfully!',
            url: imageUrl,
            urls: [imageUrl],
            filename: filename,
            size: req.file.size,
            mimetype: req.file.mimetype
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/upload/base64 (Direct Base64 Data URL Upload)
// ─────────────────────────────────────────────────────────────────────────────
router.post('/base64', requireAuth, requireAdmin, express.json({ limit: '15mb' }), (req, res) => {
    try {
        const { dataUrl, filename: userFilename } = req.body;
        if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
            return res.status(400).json({ success: false, message: 'Invalid or missing base64 image data URL.' });
        }

        // Parse mime & base64
        const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+]+);base64,(.+)$/);
        if (!matches || matches.length !== 3) {
            return res.status(400).json({ success: false, message: 'Malformed data URL.' });
        }

        const mime = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        // Check size (10MB limit)
        if (buffer.length > 10 * 1024 * 1024) {
            return res.status(400).json({ success: false, message: 'Image size exceeds 10MB limit.' });
        }

        // Determine extension
        let ext = '.jpg';
        if (mime.includes('png')) ext = '.png';
        else if (mime.includes('webp')) ext = '.webp';
        else if (mime.includes('avif')) ext = '.avif';

        const safeSlug = (userFilename || 'upload')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .slice(0, 25);
        const filename = `prod-${Date.now()}-${safeSlug}${ext}`;
        const filePath = path.join(backendUploadDir, filename);

        fs.writeFileSync(filePath, buffer);
        syncToFrontend(filename, filePath);

        const imageUrl = `/images/products/${filename}`;

        return res.json({
            success: true,
            message: 'Photo saved successfully!',
            url: imageUrl,
            filename: filename,
            size: buffer.length
        });
    } catch (err) {
        console.error('Base64 upload error:', err);
        return res.status(500).json({ success: false, message: 'Failed to process image: ' + err.message });
    }
});

export default router;
