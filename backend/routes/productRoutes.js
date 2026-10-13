import express from 'express';
import {
    getAllProducts, getProductById,
    createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public reads
router.get('/',    getAllProducts);
router.get('/:id', getProductById);

// Admin-only writes
router.post('/',      requireAuth, requireAdmin, createProduct);
router.put('/:id',    requireAuth, requireAdmin, updateProduct);
router.delete('/:id', requireAuth, requireAdmin, deleteProduct);

export default router;
