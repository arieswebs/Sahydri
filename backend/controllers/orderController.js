import { orders, products } from '../data/store.js';
import { sanitizeString, sanitizeEmail, sanitizeAddress, sanitizeNumber } from '../utils/sanitize.js';
import { query, isDatabaseConnected } from '../config/db.js';
import { pushOrderToShipway } from '../utils/shipway.js';

// Format MySQL order row to frontend shape
function formatOrder(r) {
    let items = r.items;
    if (typeof items === 'string') {
        try { items = JSON.parse(items); } catch { items = []; }
    }
    return {
        id: r.id,
        customerName: r.customer_name,
        customerEmail: r.customer_email,
        customerPhone: r.customer_phone || '',
        phone: r.customer_phone || '',
        items: Array.isArray(items) ? items : [],
        total: Number(r.total),
        status: r.status,
        address: r.address,
        paymentMethod: r.payment_method || 'Razorpay',
        razorpayOrderId: r.razorpay_order_id || '',
        razorpayPaymentId: r.razorpay_payment_id || '',
        shipwayOrderId: r.shipway_order_id || '',
        shipwayTrackingUrl: r.shipway_tracking_url || '',
        createdAt: r.created_at
    };
}

// GET /api/orders (Admin only)
export const getAllOrders = async (_req, res) => {
    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM orders ORDER BY created_at DESC');
            return res.json({ success: true, data: rows.map(formatOrder) });
        }
    } catch (err) {
        console.error('MySQL getAllOrders error:', err.message);
    }
    const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: sorted });
};

// GET /api/orders/my-orders (Authenticated customer)
export const getMyOrders = async (req, res) => {
    const userEmail = (req.user?.email || '').toLowerCase().trim();
    if (!userEmail) {
        return res.status(401).json({ success: false, message: 'Authentication required to fetch personal orders' });
    }

    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM orders WHERE LOWER(customer_email) = ? ORDER BY created_at DESC', [userEmail]);
            return res.json({ success: true, data: rows.map(formatOrder) });
        }
    } catch (err) {
        console.error('MySQL getMyOrders error:', err.message);
    }

    const customerOrders = orders
        .filter(o => (o.customerEmail || '').toLowerCase().trim() === userEmail)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, data: customerOrders });
};

// GET /api/orders/:id
export const getOrderById = async (req, res) => {
    const orderId = sanitizeString(req.params.id, 100);
    const userEmail = (req.user?.email || '').toLowerCase().trim();
    const isAdmin = req.user?.role === 'admin';

    try {
        if (isDatabaseConnected()) {
            const rows = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
            if (rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
            const order = formatOrder(rows[0]);

            if (!isAdmin && (order.customerEmail || '').toLowerCase().trim() !== userEmail) {
                return res.status(403).json({ success: false, message: 'Access denied to this order' });
            }
            return res.json({ success: true, data: order });
        }
    } catch (err) {
        console.error('MySQL getOrderById error:', err.message);
    }

    const order = orders.find(o => o.id === orderId);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!isAdmin && (order.customerEmail || '').toLowerCase().trim() !== userEmail) {
        return res.status(403).json({ success: false, message: 'Access denied to this order' });
    }

    res.json({ success: true, data: order });
};

// POST /api/orders (Creates order in MySQL)
export const createOrder = async (req, res) => {
    const { customerName, customerEmail, phone, customerPhone, items, total, address, paymentMethod, razorpayOrderId, razorpayPaymentId } = req.body;

    const cleanName = sanitizeString(customerName, 100);
    const cleanEmail = sanitizeEmail(customerEmail) || (req.user?.email ? sanitizeEmail(req.user.email) : '');
    const cleanPhone = sanitizePhone(phone || customerPhone || (req.user?.phone ? req.user.phone : ''));
    const cleanAddress = sanitizeAddress(address, 300);
    const cleanMethod = sanitizeString(paymentMethod, 50) || 'Razorpay';

    if (!cleanName) {
        return res.status(400).json({ success: false, message: 'Customer name is required' });
    }
    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    // Sanitize and validate each order item
    const sanitizedItems = items.map(item => ({
        productId: sanitizeString(item.productId || item.id, 100),
        name: sanitizeString(item.name, 120),
        weight: sanitizeString(item.weight, 50) || 'Standard',
        price: sanitizeNumber(item.price, 0, 0, 100000),
        quantity: Math.max(1, Math.min(100, Math.floor(sanitizeNumber(item.quantity || item.qty, 1, 1, 100))))
    }));

    const cleanTotal = sanitizeNumber(total, 0, 0, 1000000);
    const newOrderId = `ORD-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
        id: newOrderId,
        customerName: cleanName,
        customerEmail: cleanEmail,
        customerPhone: cleanPhone,
        phone: cleanPhone,
        items: sanitizedItems,
        total: cleanTotal,
        status: 'pending',
        address: cleanAddress,
        paymentMethod: cleanMethod,
        razorpayOrderId: sanitizeString(razorpayOrderId, 100),
        razorpayPaymentId: sanitizeString(razorpayPaymentId, 100),
        createdAt: new Date().toISOString()
    };

    try {
        if (isDatabaseConnected()) {
            await query(`
                INSERT INTO orders (
                    id, customer_name, customer_email, customer_phone, items, total,
                    status, address, payment_method, razorpay_order_id, razorpay_payment_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
            `, [
                newOrder.id, newOrder.customerName, newOrder.customerEmail, newOrder.customerPhone,
                JSON.stringify(newOrder.items), newOrder.total, newOrder.status,
                newOrder.address, newOrder.paymentMethod,
                newOrder.razorpayOrderId, newOrder.razorpayPaymentId
            ]);

            // Decrement inventory stock in MySQL for each purchased product
            for (const item of newOrder.items) {
                if (item.productId) {
                    try {
                        await query('UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?', [item.quantity, item.productId]);
                    } catch (stockErr) {
                        console.error('Stock decrement error for', item.productId, stockErr.message);
                    }
                }
            }

            // Sync in-memory store
            for (const item of newOrder.items) {
                const prod = products.find(p => p.id === item.productId);
                if (prod && typeof prod.stock === 'number') {
                    prod.stock = Math.max(0, prod.stock - item.quantity);
                }
            }
            orders.unshift(newOrder);

            // Asynchronously dispatch to Shipway for fulfillment & tracking
            pushOrderToShipway(newOrder).catch(e => console.warn('[Shipway Auto-Push]', e.message));

            return res.status(201).json({ success: true, data: newOrder });
        }
    } catch (err) {
        console.error('MySQL createOrder error:', err.message);
        return res.status(500).json({ success: false, message: 'Failed to record order in database.' });
    }

    // In-memory fallback
    for (const item of newOrder.items) {
        const prod = products.find(p => p.id === item.productId);
        if (prod && typeof prod.stock === 'number') {
            prod.stock = Math.max(0, prod.stock - item.quantity);
        }
    }
    orders.unshift(newOrder);

    // Asynchronously dispatch to Shipway for fulfillment & tracking
    pushOrderToShipway(newOrder).catch(e => console.warn('[Shipway Auto-Push]', e.message));

    res.status(201).json({ success: true, data: newOrder });
};

// PATCH /api/orders/:id/status (Admin only)
export const updateOrderStatus = async (req, res) => {
    const orderId = sanitizeString(req.params.id, 100);
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    try {
        if (isDatabaseConnected()) {
            await query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
            const updated = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
            if (updated.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
            
            const formatted = formatOrder(updated[0]);
            const memIdx = orders.findIndex(o => o.id === orderId);
            if (memIdx >= 0) orders[memIdx] = formatted;
            
            return res.json({ success: true, data: formatted });
        }
    } catch (err) {
        console.error('MySQL updateOrderStatus error:', err.message);
    }

    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    orders[index].status = status;

    if (status === 'shipped') {
        pushOrderToShipway(orders[index]).catch(e => console.warn('[Shipway Status Push]', e.message));
    }

    res.json({ success: true, data: orders[index] });
};

// DELETE /api/orders/:id (Admin only)
export const deleteOrder = async (req, res) => {
    const orderId = sanitizeString(req.params.id, 100);

    try {
        if (isDatabaseConnected()) {
            const existing = await query('SELECT * FROM orders WHERE id = ?', [orderId]);
            if (existing.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });
            await query('DELETE FROM orders WHERE id = ?', [orderId]);
            
            const memIdx = orders.findIndex(o => o.id === orderId);
            if (memIdx >= 0) orders.splice(memIdx, 1);
            
            return res.json({ success: true, data: formatOrder(existing[0]), message: 'Order deleted' });
        }
    } catch (err) {
        console.error('MySQL deleteOrder error:', err.message);
    }

    const index = orders.findIndex(o => o.id === orderId);
    if (index === -1) return res.status(404).json({ success: false, message: 'Order not found' });
    const removed = orders.splice(index, 1);
    res.json({ success: true, data: removed[0], message: 'Order deleted' });
};

// GET /api/orders/customers/all (Admin only - Aggregated customer profiles)
export const getAllCustomers = async (_req, res) => {
    try {
        if (isDatabaseConnected()) {
            const rows = await query(`
                SELECT 
                    LOWER(customer_email) as email,
                    MAX(customer_name) as name,
                    MAX(customer_phone) as phone,
                    MAX(address) as address,
                    COUNT(*) as orders_count,
                    SUM(CASE WHEN status != 'cancelled' THEN total ELSE 0 END) as total_spent,
                    MAX(created_at) as last_order_date,
                    MIN(created_at) as first_order_date
                FROM orders 
                WHERE customer_email IS NOT NULL AND customer_email != ''
                GROUP BY LOWER(customer_email)
                ORDER BY last_order_date DESC
            `);
            const customerList = rows.map((r, idx) => ({
                id: `CUST-${String(idx + 1).padStart(3, '0')}`,
                name: r.name || 'Anonymous Customer',
                email: r.email,
                phone: r.phone || '',
                address: r.address || '—',
                orders: Number(r.orders_count) || 0,
                spent: Number(r.total_spent) || 0,
                lastOrder: r.last_order_date,
                joined: r.first_order_date ? new Date(r.first_order_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'
            }));
            return res.json({ success: true, data: customerList });
        }
    } catch (err) {
        console.error('MySQL getAllCustomers error:', err.message);
    }

    // In-memory customer aggregation from store.js orders
    const map = new Map();
    for (const o of orders) {
        const email = (o.customerEmail || '').toLowerCase().trim();
        if (!email) continue;
        if (!map.has(email)) {
            map.set(email, {
                id: `CUST-${String(map.size + 1).padStart(3, '0')}`,
                name: o.customerName || 'Anonymous Customer',
                email: email,
                phone: o.customerPhone || o.phone || '',
                address: o.address || '—',
                orders: 0,
                spent: 0,
                lastOrder: o.createdAt,
                joined: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recent'
            });
        }
        const c = map.get(email);
        c.orders += 1;
        if (o.status !== 'cancelled') {
            c.spent += (Number(o.total) || 0);
        }
        if (new Date(o.createdAt) > new Date(c.lastOrder)) {
            c.lastOrder = o.createdAt;
            if (o.customerName) c.name = o.customerName;
            if (o.customerPhone || o.phone) c.phone = o.customerPhone || o.phone;
            if (o.address) c.address = o.address;
        }
    }
    const customerList = Array.from(map.values());
    res.json({ success: true, data: customerList });
};

