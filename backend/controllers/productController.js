import { products } from '../data/store.js';
import { sanitizeString, sanitizeNumber } from '../utils/sanitize.js';
import { query, isDatabaseConnected } from '../config/db.js';

// Helper to format MySQL snake_case product row to frontend camelCase
function formatProduct(r) {
    return {
        id: r.id,
        name: r.name,
        subname: r.subname || '',
        category: r.category,
        price: Number(r.price),
        originalPrice: Number(r.original_price || r.price),
        weight: r.weight || 'Standard',
        rating: Number(r.rating || 5.0),
        reviewsCount: Number(r.reviews_count || 0),
        stock: Number(r.stock || 0),
        tag: r.tag || '',
        typeTag: r.type_tag || '',
        originBadge: r.origin_badge || '',
        image: r.image || '',
        description: r.description || '',
        elevation: r.elevation || '',
        harvestSeason: r.harvest_season || '',
        aromaProfile: r.aroma_profile || '',
        curcuminOrOil: r.curcumin_or_oil || ''
    };
}

// GET /api/products
export const getAllProducts = async (_req, res) => {
    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM products ORDER BY created_at ASC');
            return res.json({ success: true, data: rows.map(formatProduct) });
        }
    } catch (err) {
        console.error('MySQL getAllProducts fallback:', err.message);
    }
    // In-memory fallback
    res.json({ success: true, data: products });
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
    const cleanId = sanitizeString(req.params.id, 100);

    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM products WHERE id = ?', [cleanId]);
            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            return res.json({ success: true, data: formatProduct(rows[0]) });
        }
    } catch (err) {
        console.error('MySQL getProductById fallback:', err.message);
    }

    // In-memory fallback
    const product = products.find(p => p.id === cleanId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
};

// POST /api/products (Admin only)
export const createProduct = async (req, res) => {
    const { id, name, subname, category, price, originalPrice, weight, stock, image, description, tag, typeTag, originBadge, elevation, harvestSeason, aromaProfile, curcuminOrOil } = req.body;

    const cleanName = sanitizeString(name, 120);
    const cleanCategory = sanitizeString(category, 50);

    if (!cleanName || !price || !cleanCategory) {
        return res.status(400).json({ success: false, message: 'name, price, and category are required' });
    }

    const autoId = (cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'product') + '-' + Date.now().toString().slice(-4);
    const cleanId = sanitizeString(id, 100) || autoId;

    const cleanPrice = sanitizeNumber(price, 0, 1, 1000000);
    const cleanOrigPrice = sanitizeNumber(originalPrice, cleanPrice, 1, 1000000);
    const cleanStock = Math.floor(sanitizeNumber(stock, 100, 0, 100000));

    const newProduct = {
        id: cleanId,
        name: cleanName,
        subname: sanitizeString(subname, 150),
        category: cleanCategory,
        price: cleanPrice,
        originalPrice: cleanOrigPrice,
        weight: sanitizeString(weight, 30) || 'Standard',
        stock: cleanStock,
        rating: 5.0,
        reviewsCount: 0,
        image: sanitizeString(image, 500) || '/images/products/cardamom_sahydri.jpg',
        description: sanitizeString(description, 1000) || 'Single-estate harvested from high altitude Western Ghats.',
        tag: sanitizeString(tag, 50) || 'PREMIUM',
        typeTag: sanitizeString(typeTag, 50) || 'ORGANIC',
        originBadge: sanitizeString(originBadge, 50) || 'WESTERN GHATS',
        elevation: sanitizeString(elevation, 50) || '3,000 ft',
        harvestSeason: sanitizeString(harvestSeason, 50) || 'Peak Season',
        aromaProfile: sanitizeString(aromaProfile, 100) || 'Rich botanical aromatics',
        curcuminOrOil: sanitizeString(curcuminOrOil, 100) || 'High Essential Oil'
    };

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT id FROM products WHERE id = ?', [cleanId]);
            if (existing.length > 0) {
                return res.status(409).json({ success: false, message: 'Product with this ID already exists' });
            }

            await query(`
                INSERT INTO products (
                    id, name, subname, category, price, original_price, weight,
                    rating, reviews_count, stock, tag, type_tag, origin_badge,
                    image, description, elevation, harvest_season, aroma_profile, curcumin_or_oil
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                newProduct.id, newProduct.name, newProduct.subname, newProduct.category,
                newProduct.price, newProduct.originalPrice, newProduct.weight,
                newProduct.rating, newProduct.reviewsCount, newProduct.stock,
                newProduct.tag, newProduct.typeTag, newProduct.originBadge,
                newProduct.image, newProduct.description, newProduct.elevation,
                newProduct.harvestSeason, newProduct.aromaProfile, newProduct.curcuminOrOil
            ]);

            // Keep in-memory store in sync
            const memIdx = products.findIndex(p => p.id === cleanId);
            if (memIdx >= 0) products[memIdx] = newProduct;
            else products.push(newProduct);

            return res.status(201).json({ success: true, data: newProduct });
        }
    } catch (err) {
        console.error('MySQL createProduct error:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to create product in database.' });
    }

    // In-memory fallback
    if (products.some(p => p.id === cleanId)) {
        return res.status(409).json({ success: false, message: 'Product with this ID already exists' });
    }
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
};

// PUT /api/products/:id (Admin only)
export const updateProduct = async (req, res) => {
    const cleanId = sanitizeString(req.params.id, 100);

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT * FROM products WHERE id = ?', [cleanId]);
            if (existing.length === 0) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            const current = existing[0];
            const name = req.body.name !== undefined ? sanitizeString(req.body.name, 120) : current.name;
            const subname = req.body.subname !== undefined ? sanitizeString(req.body.subname, 150) : current.subname;
            const category = req.body.category !== undefined ? sanitizeString(req.body.category, 50) : current.category;
            const price = req.body.price !== undefined ? sanitizeNumber(req.body.price, current.price, 1, 1000000) : current.price;
            const originalPrice = req.body.originalPrice !== undefined ? sanitizeNumber(req.body.originalPrice, price, 1, 1000000) : current.original_price;
            const weight = req.body.weight !== undefined ? sanitizeString(req.body.weight, 30) : current.weight;
            const stock = req.body.stock !== undefined ? Math.floor(sanitizeNumber(req.body.stock, current.stock, 0, 100000)) : current.stock;
            const image = req.body.image !== undefined ? sanitizeString(req.body.image, 500) : current.image;
            const description = req.body.description !== undefined ? sanitizeString(req.body.description, 1000) : current.description;
            const tag = req.body.tag !== undefined ? sanitizeString(req.body.tag, 50) : current.tag;
            const typeTag = req.body.typeTag !== undefined ? sanitizeString(req.body.typeTag, 50) : current.type_tag;
            const originBadge = req.body.originBadge !== undefined ? sanitizeString(req.body.originBadge, 50) : current.origin_badge;
            const elevation = req.body.elevation !== undefined ? sanitizeString(req.body.elevation, 50) : current.elevation;
            const harvestSeason = req.body.harvestSeason !== undefined ? sanitizeString(req.body.harvestSeason, 50) : current.harvest_season;
            const aromaProfile = req.body.aromaProfile !== undefined ? sanitizeString(req.body.aromaProfile, 100) : current.aroma_profile;
            const curcuminOrOil = req.body.curcuminOrOil !== undefined ? sanitizeString(req.body.curcuminOrOil, 100) : current.curcumin_or_oil;

            await query(`
                UPDATE products SET
                    name = ?, subname = ?, category = ?, price = ?, original_price = ?,
                    weight = ?, stock = ?, image = ?, description = ?, tag = ?,
                    type_tag = ?, origin_badge = ?, elevation = ?, harvest_season = ?,
                    aroma_profile = ?, curcumin_or_oil = ?
                WHERE id = ?
            `, [
                name, subname, category, price, originalPrice,
                weight, stock, image, description, tag,
                typeTag, originBadge, elevation, harvestSeason,
                aromaProfile, curcuminOrOil, cleanId
            ]);

            const updated = await query('SELECT * FROM products WHERE id = ?', [cleanId]);
            const formatted = formatProduct(updated[0]);

            // Sync in-memory store
            const memIdx = products.findIndex(p => p.id === cleanId);
            if (memIdx >= 0) products[memIdx] = formatted;

            return res.json({ success: true, data: formatted });
        }
    } catch (err) {
        console.error('MySQL updateProduct error:', err.message);
    }

    // In-memory fallback
    const index = products.findIndex(p => p.id === cleanId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });

    const updates = {};
    if (req.body.name !== undefined) updates.name = sanitizeString(req.body.name, 120);
    if (req.body.subname !== undefined) updates.subname = sanitizeString(req.body.subname, 150);
    if (req.body.category !== undefined) updates.category = sanitizeString(req.body.category, 50);
    if (req.body.price !== undefined) updates.price = sanitizeNumber(req.body.price, products[index].price, 1, 1000000);
    if (req.body.originalPrice !== undefined) updates.originalPrice = sanitizeNumber(req.body.originalPrice, updates.price || products[index].originalPrice, 1, 1000000);
    if (req.body.weight !== undefined) updates.weight = sanitizeString(req.body.weight, 30);
    if (req.body.stock !== undefined) updates.stock = Math.floor(sanitizeNumber(req.body.stock, products[index].stock, 0, 100000));
    if (req.body.image !== undefined) updates.image = sanitizeString(req.body.image, 500);
    if (req.body.description !== undefined) updates.description = sanitizeString(req.body.description, 1000);
    if (req.body.tag !== undefined) updates.tag = sanitizeString(req.body.tag, 50);
    if (req.body.typeTag !== undefined) updates.typeTag = sanitizeString(req.body.typeTag, 50);
    if (req.body.originBadge !== undefined) updates.originBadge = sanitizeString(req.body.originBadge, 50);
    if (req.body.elevation !== undefined) updates.elevation = sanitizeString(req.body.elevation, 50);
    if (req.body.harvestSeason !== undefined) updates.harvestSeason = sanitizeString(req.body.harvestSeason, 50);
    if (req.body.aromaProfile !== undefined) updates.aromaProfile = sanitizeString(req.body.aromaProfile, 100);
    if (req.body.curcuminOrOil !== undefined) updates.curcuminOrOil = sanitizeString(req.body.curcuminOrOil, 100);

    products[index] = { ...products[index], ...updates };
    res.json({ success: true, data: products[index] });
};

// DELETE /api/products/:id (Admin only)
export const deleteProduct = async (req, res) => {
    const cleanId = sanitizeString(req.params.id, 100);

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT * FROM products WHERE id = ?', [cleanId]);
            if (existing.length === 0) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            await query('DELETE FROM products WHERE id = ?', [cleanId]);
            const memIdx = products.findIndex(p => p.id === cleanId);
            if (memIdx >= 0) products.splice(memIdx, 1);
            return res.json({ success: true, data: formatProduct(existing[0]), message: 'Product deleted' });
        }
    } catch (err) {
        console.error('MySQL deleteProduct error:', err.message);
    }

    // In-memory fallback
    const index = products.findIndex(p => p.id === cleanId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    const removed = products.splice(index, 1);
    res.json({ success: true, data: removed[0], message: 'Product deleted' });
};
