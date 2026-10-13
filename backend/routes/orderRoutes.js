import express from 'express';
import {
    getAllOrders, getOrderById,
    createOrder, updateOrderStatus, deleteOrder
} from '../controllers/orderController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Any authenticated user can create an order (called after Razorpay payment)
router.post('/', createOrder);

// Admin-only: view all, update status, delete
router.get('/',           requireAdmin, getAllOrders);
router.get('/:id',        requireAdmin, getOrderById);
router.patch('/:id/status', requireAdmin, updateOrderStatus);
router.delete('/:id',     requireAdmin, deleteOrder);

export default router;
