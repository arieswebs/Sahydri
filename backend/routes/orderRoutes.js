import express from 'express';
import {
    getAllOrders, getOrderById, getMyOrders,
    createOrder, updateOrderStatus, deleteOrder
} from '../controllers/orderController.js';
import { requireAuth, requireAdmin, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Authenticated or guest order creation
router.post('/', optionalAuth, createOrder);

// Authenticated customer: fetch their personal order history
router.get('/my-orders', requireAuth, getMyOrders);

// Admin-only: view all orders
router.get('/', requireAuth, requireAdmin, getAllOrders);

// View order details (Admin or owner)
router.get('/:id', requireAuth, getOrderById);

// Admin-only: update status & delete
router.patch('/:id/status', requireAuth, requireAdmin, updateOrderStatus);
router.delete('/:id', requireAuth, requireAdmin, deleteOrder);

export default router;
