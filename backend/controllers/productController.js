import { products } from '../data/store.js';
import { sanitizeString, sanitizeNumber } from '../utils/sanitize.js';
import { query, isDatabaseConnected } from '../config/db.js';

// Helper to format MySQL snake_case product row to frontend camelCase
function formatProduct(r) {
    let images = [];
    if (r.images) {
        if (Array.isArray(r.images)) {
            images = r.images;
        } else if (typeof r.images === 'string') {
            try {
                const parsed = JSON.parse(r.images);
                if (Array.isArray(parsed)) images = parsed;
                else images = [r.images];
            } catch {
                images = r.images.split(',').map(s => s.trim()).filter(Boolean);
            }
        }
    }
    if (!images || images.length === 0) {
        if (r.image) images = [r.image];
    }

    let weights = [];
    if (r.weights) {
        if (Array.isArray(r.weights)) {
            weights = r.weights;
        } else if (typeof r.weights === 'string') {
            try {
                const parsed = JSON.parse(r.weights);
                if (Array.isArray(parsed)) weights = parsed;
                else weights = [r.weights];
            } catch {
                weights = r.weights.split(',').map(s => ({ weight: s.trim() })).filter(w => w.weight);
            }
        }
    }
    if (!weights || weights.length === 0) {
        if (r.weight) {
            weights = [{ weight: r.weight, price: Number(r.price), originalPrice: Number(r.original_price || r.price) }];
        }
    }

    return {
        id: r.id,
        name: r.name,
        subname: r.subname || '',
        category: r.category,
        price: Number(r.price),
        originalPrice: Number(r.original_price || r.price),
        weight: r.weight || (weights[0]?.weight || 'Standard'),
        weights: weights,
        rating: Number(r.rating || 5.0),
        reviewsCount: Number(r.reviews_count || 0),
        stock: Number(r.stock || 0),
        tag: r.tag || '',
        typeTag: r.type_tag || '',
        originBadge: r.origin_badge || '',
        image: r.image || (images[0] || ''),
        images: images,
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
    const { id, name, subname, category, price, originalPrice, weight, weights, stock, image, images, description, tag, typeTag, originBadge, elevation, harvestSeason, aromaProfile, curcuminOrOil } = req.body;

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

    // Process multiple weights / pack variants
    let weightList = [];
    if (Array.isArray(weights)) {
        weightList = weights.map(w => {
            if (typeof w === 'string') {
                return { weight: sanitizeString(w, 30), price: cleanPrice, originalPrice: cleanOrigPrice, stock: cleanStock };
            }
            return {
                weight: sanitizeString(w.weight || w.label, 30),
                price: sanitizeNumber(w.price, cleanPrice, 1, 1000000),
                originalPrice: sanitizeNumber(w.originalPrice, cleanOrigPrice, 1, 1000000),
                stock: Math.floor(sanitizeNumber(w.stock, cleanStock, 0, 100000))
            };
        }).filter(w => Boolean(w.weight));
    }
    const cleanPrimaryWeight = sanitizeString(weight, 30) || (weightList[0]?.weight || 'Standard');
    if (weightList.length === 0) {
        weightList = [{ weight: cleanPrimaryWeight, price: cleanPrice, originalPrice: cleanOrigPrice, stock: cleanStock }];
    }

    // Process multiple product images
    let imageList = [];
    if (Array.isArray(images)) {
        imageList = images.map(img => sanitizeString(img, 500)).filter(Boolean);
    } else if (typeof images === 'string') {
        try {
            const parsed = JSON.parse(images);
            if (Array.isArray(parsed)) imageList = parsed.map(img => sanitizeString(img, 500)).filter(Boolean);
        } catch {
            imageList = images.split(',').map(s => sanitizeString(s.trim(), 500)).filter(Boolean);
        }
    }
    const cleanSingleImage = sanitizeString(image, 500);
    if (cleanSingleImage && !imageList.includes(cleanSingleImage)) {
        imageList.unshift(cleanSingleImage);
    }
    if (imageList.length === 0) {
        imageList = ['/images/products/cardamom_sahydri.jpg'];
    }
    const primaryImage = imageList[0];

    const newProduct = {
        id: cleanId,
        name: cleanName,
        subname: sanitizeString(subname, 150),
        category: cleanCategory,
        price: cleanPrice,
        originalPrice: cleanOrigPrice,
        weight: cleanPrimaryWeight,
        weights: weightList,
        stock: cleanStock,
        rating: 5.0,
        reviewsCount: 0,
        image: primaryImage,
        images: imageList,
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

            try {
                await query(`
                    INSERT INTO products (
                        id, name, subname, category, price, original_price, weight, weights,
                        rating, reviews_count, stock, tag, type_tag, origin_badge,
                        image, images, description, elevation, harvest_season, aroma_profile, curcumin_or_oil
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `, [
                    newProduct.id, newProduct.name, newProduct.subname, newProduct.category,
                    newProduct.price, newProduct.originalPrice, newProduct.weight, JSON.stringify(newProduct.weights),
                    newProduct.rating, newProduct.reviewsCount, newProduct.stock,
                    newProduct.tag, newProduct.typeTag, newProduct.originBadge,
                    newProduct.image, JSON.stringify(newProduct.images), newProduct.description, newProduct.elevation,
                    newProduct.harvestSeason, newProduct.aromaProfile, newProduct.curcuminOrOil
                ]);
            } catch {
                try {
                    await query(`
                        INSERT INTO products (
                            id, name, subname, category, price, original_price, weight,
                            rating, reviews_count, stock, tag, type_tag, origin_badge,
                            image, images, description, elevation, harvest_season, aroma_profile, curcumin_or_oil
                        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `, [
                        newProduct.id, newProduct.name, newProduct.subname, newProduct.category,
                        newProduct.price, newProduct.originalPrice, newProduct.weight,
                        newProduct.rating, newProduct.reviewsCount, newProduct.stock,
                        newProduct.tag, newProduct.typeTag, newProduct.originBadge,
                        newProduct.image, JSON.stringify(newProduct.images), newProduct.description, newProduct.elevation,
                        newProduct.harvestSeason, newProduct.aromaProfile, newProduct.curcuminOrOil
                    ]);
                } catch {
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
                }
            }

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
            const stock = req.body.stock !== undefined ? Math.floor(sanitizeNumber(req.body.stock, current.stock, 0, 100000)) : current.stock;

            // Handle multiple weights
            let weightList = undefined;
            if (req.body.weights !== undefined) {
                if (Array.isArray(req.body.weights)) {
                    weightList = req.body.weights.map(w => {
                        if (typeof w === 'string') {
                            return { weight: sanitizeString(w, 30), price: price, originalPrice: originalPrice, stock: stock };
                        }
                        return {
                            weight: sanitizeString(w.weight || w.label, 30),
                            price: sanitizeNumber(w.price, price, 1, 1000000),
                            originalPrice: sanitizeNumber(w.originalPrice, originalPrice, 1, 1000000),
                            stock: Math.floor(sanitizeNumber(w.stock, stock, 0, 100000))
                        };
                    }).filter(w => Boolean(w.weight));
                }
            }
            const weight = req.body.weight !== undefined 
                ? sanitizeString(req.body.weight, 30) 
                : (weightList && weightList[0]?.weight ? weightList[0].weight : current.weight);

            // Handle multiple images
            let imageList = undefined;
            if (req.body.images !== undefined) {
                if (Array.isArray(req.body.images)) {
                    imageList = req.body.images.map(img => sanitizeString(img, 500)).filter(Boolean);
                } else if (typeof req.body.images === 'string') {
                    try {
                        const parsed = JSON.parse(req.body.images);
                        if (Array.isArray(parsed)) imageList = parsed.map(img => sanitizeString(img, 500)).filter(Boolean);
                    } catch {
                        imageList = req.body.images.split(',').map(s => sanitizeString(s.trim(), 500)).filter(Boolean);
                    }
                }
            }
            let image = current.image;
            if (req.body.image !== undefined) {
                image = sanitizeString(req.body.image, 500);
            } else if (imageList && imageList.length > 0) {
                image = imageList[0];
            }
            if (imageList && image && !imageList.includes(image)) {
                imageList.unshift(image);
            }

            const description = req.body.description !== undefined ? sanitizeString(req.body.description, 1000) : current.description;
            const tag = req.body.tag !== undefined ? sanitizeString(req.body.tag, 50) : current.tag;
            const typeTag = req.body.typeTag !== undefined ? sanitizeString(req.body.typeTag, 50) : current.type_tag;
            const originBadge = req.body.originBadge !== undefined ? sanitizeString(req.body.originBadge, 50) : current.origin_badge;
            const elevation = req.body.elevation !== undefined ? sanitizeString(req.body.elevation, 50) : current.elevation;
            const harvestSeason = req.body.harvestSeason !== undefined ? sanitizeString(req.body.harvestSeason, 50) : current.harvest_season;
            const aromaProfile = req.body.aromaProfile !== undefined ? sanitizeString(req.body.aromaProfile, 100) : current.aroma_profile;
            const curcuminOrOil = req.body.curcuminOrOil !== undefined ? sanitizeString(req.body.curcuminOrOil, 100) : current.curcumin_or_oil;

            try {
                await query(`
                    UPDATE products SET
                        name = ?, subname = ?, category = ?, price = ?, original_price = ?,
                        weight = ?, weights = ?, stock = ?, image = ?, images = ?, description = ?, tag = ?,
                        type_tag = ?, origin_badge = ?, elevation = ?, harvest_season = ?,
                        aroma_profile = ?, curcumin_or_oil = ?
                    WHERE id = ?
                `, [
                    name, subname, category, price, originalPrice,
                    weight, weightList !== undefined ? JSON.stringify(weightList) : current.weights, stock, image, imageList !== undefined ? JSON.stringify(imageList) : current.images, description, tag,
                    typeTag, originBadge, elevation, harvestSeason,
                    aromaProfile, curcuminOrOil, cleanId
                ]);
            } catch {
                try {
                    await query(`
                        UPDATE products SET
                            name = ?, subname = ?, category = ?, price = ?, original_price = ?,
                            weight = ?, stock = ?, image = ?, images = ?, description = ?, tag = ?,
                            type_tag = ?, origin_badge = ?, elevation = ?, harvest_season = ?,
                            aroma_profile = ?, curcumin_or_oil = ?
                        WHERE id = ?
                    `, [
                        name, subname, category, price, originalPrice,
                        weight, stock, image, imageList !== undefined ? JSON.stringify(imageList) : current.images, description, tag,
                        typeTag, originBadge, elevation, harvestSeason,
                        aromaProfile, curcuminOrOil, cleanId
                    ]);
                } catch {
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
                }
            }

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
    if (req.body.stock !== undefined) updates.stock = Math.floor(sanitizeNumber(req.body.stock, products[index].stock, 0, 100000));
    
    // Multiple weights fallback
    if (req.body.weights !== undefined) {
        if (Array.isArray(req.body.weights)) {
            updates.weights = req.body.weights.map(w => {
                if (typeof w === 'string') {
                    return { weight: sanitizeString(w, 30), price: updates.price || products[index].price, originalPrice: updates.originalPrice || products[index].originalPrice, stock: updates.stock || products[index].stock };
                }
                return {
                    weight: sanitizeString(w.weight || w.label, 30),
                    price: sanitizeNumber(w.price, updates.price || products[index].price, 1, 1000000),
                    originalPrice: sanitizeNumber(w.originalPrice, updates.originalPrice || products[index].originalPrice, 1, 1000000),
                    stock: Math.floor(sanitizeNumber(w.stock, updates.stock || products[index].stock, 0, 100000))
                };
            }).filter(w => Boolean(w.weight));
        }
    }
    if (req.body.weight !== undefined) {
        updates.weight = sanitizeString(req.body.weight, 30);
    } else if (updates.weights && updates.weights.length > 0) {
        updates.weight = updates.weights[0].weight;
    }

    // Multiple images fallback
    if (req.body.images !== undefined) {
        if (Array.isArray(req.body.images)) {
            updates.images = req.body.images.map(img => sanitizeString(img, 500)).filter(Boolean);
        } else if (typeof req.body.images === 'string') {
            try {
                const parsed = JSON.parse(req.body.images);
                if (Array.isArray(parsed)) updates.images = parsed;
            } catch {
                updates.images = req.body.images.split(',').map(s => sanitizeString(s.trim(), 500)).filter(Boolean);
            }
        }
    }
    if (req.body.image !== undefined) {
        updates.image = sanitizeString(req.body.image, 500);
    } else if (updates.images && updates.images.length > 0) {
        updates.image = updates.images[0];
    }
    if (updates.images && updates.image && !updates.images.includes(updates.image)) {
        updates.images.unshift(updates.image);
    }

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
