import { orders } from '../data/store.js';

// GET /api/orders
export const getAllOrders = (_req, res) => {
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: sorted });
};

// GET /api/orders/:id
export const getOrderById = (req, res) => {
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
};

// POST /api/orders
export const createOrder = (req, res) => {
    const { customerName, customerEmail, items, total, address, paymentMethod } = req.body;
    if (!customerName || !items || !total) {
        return res.status(400).json({ success: false, message: 'customerName, items, and total are required' });
    }
    const newOrder = {
        id: `ORD-${Date.now()}`,
        customerName,
        customerEmail: customerEmail || '',
        items,
        total: Number(total),
        status: 'pending',
        address: address || '',
        paymentMethod: paymentMethod || 'COD',
        createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    res.status(201).json({ success: true, data: newOrder });
};

// PATCH /api/orders/:id/status
export const updateOrderStatus = (req, res) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    orders[index].status = status;
    res.json({ success: true, data: orders[index] });
};

// DELETE /api/orders/:id
export const deleteOrder = (req, res) => {
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    const removed = orders.splice(index, 1);
    res.json({ success: true, data: removed[0], message: 'Order deleted' });
};
