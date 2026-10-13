import { products } from '../data/store.js';

// GET /api/products
export const getAllProducts = (_req, res) => {
    res.json({ success: true, data: products });
};

// GET /api/products/:id
export const getProductById = (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
};

// POST /api/products
export const createProduct = (req, res) => {
    const { id, name, subname, category, price, originalPrice, weight, stock, image, description, tag, typeTag, originBadge } = req.body;
    if (!id || !name || !price || !category) {
        return res.status(400).json({ success: false, message: 'id, name, price, and category are required' });
    }
    if (products.find(p => p.id === id)) {
        return res.status(409).json({ success: false, message: 'Product with this ID already exists' });
    }
    const newProduct = {
        id,
        name,
        subname: subname || '',
        category,
        price: Number(price),
        originalPrice: Number(originalPrice) || Number(price),
        weight: weight || '—',
        stock: Number(stock) || 0,
        rating: 5.0,
        reviewsCount: 0,
        image: image || '/images/products/placeholder.jpg',
        description: description || '',
        tag: tag || 'NEW',
        typeTag: typeTag || 'NEW',
        originBadge: originBadge || '',
        elevation: '',
        harvestSeason: '',
        aromaProfile: '',
        curcuminOrOil: ''
    };
    products.push(newProduct);
    res.status(201).json({ success: true, data: newProduct });
};

// PUT /api/products/:id
export const updateProduct = (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    products[index] = { ...products[index], ...req.body };
    res.json({ success: true, data: products[index] });
};

// DELETE /api/products/:id
export const deleteProduct = (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Product not found' });
    const removed = products.splice(index, 1);
    res.json({ success: true, data: removed[0], message: 'Product deleted' });
};
