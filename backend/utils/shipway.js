/**
 * Shipway Shipping & Logistics Integration Module
 * Official Shipway API connector for order dispatch, auto-tracking and WISMO suppression
 */

const SHIPWAY_API_BASE = 'https://app.shipway.com/api';
const SHIPWAY_TRACK_BASE = 'https://shipway.com/track';

export function getShipwayCredentials() {
    const username = process.env.SHIPWAY_USERNAME || 'sahyadrigold520@gmail.com';
    const licenseKey = process.env.SHIPWAY_LICENSE_KEY || '4N9D0Ox6sR7N87A868ThM1flc48Y731q';
    return { username, licenseKey };
}

export function getShipwayAuthHeader() {
    const { username, licenseKey } = getShipwayCredentials();
    const token = Buffer.from(`${username}:${licenseKey}`).toString('base64');
    return `Basic ${token}`;
}

/**
 * Push order details to Shipway for fulfillment and automated customer updates
 */
export async function pushOrderToShipway(order) {
    const { username, licenseKey } = getShipwayCredentials();
    if (!username || !licenseKey) {
        console.warn('[Shipway] Missing credentials; skipping push');
        return { success: false, message: 'Shipway credentials not configured' };
    }

    const nameParts = (order.customerName || 'Valued Customer').trim().split(' ');
    const firstName = nameParts[0] || 'Customer';
    const lastName = nameParts.slice(1).join(' ') || 'Sahydri';

    const payload = {
        username,
        license_key: licenseKey,
        order_id: String(order.id || ''),
        fname: firstName,
        lname: lastName,
        email: order.customerEmail || '',
        phone: order.customerPhone || order.phone || '',
        address: order.address || '',
        city: order.city || '',
        state: order.state || '',
        country: 'India',
        pincode: order.pincode || '',
        payment_type: (order.paymentMethod || '').toLowerCase().includes('cod') ? 'cod' : 'prepaid',
        order_date: order.createdAt || new Date().toISOString(),
        amount: String(order.total || 0),
        products: (order.items || []).map(item => ({
            product_name: item.name || 'Artisanal Reserve Harvest',
            product_quantity: String(item.quantity || item.qty || 1),
            product_price: String(item.price || 0)
        }))
    };

    try {
        const response = await fetch(`${SHIPWAY_API_BASE}/PushOrderData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': getShipwayAuthHeader()
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json().catch(() => null);

        console.log(`[Shipway] Pushed order #${order.id}:`, data || response.status);
        return {
            success: response.ok,
            status: response.status,
            trackingUrl: `${SHIPWAY_TRACK_BASE}/${order.id}`,
            data
        };
    } catch (err) {
        console.error('[Shipway API Error]', err.message);
        return {
            success: false,
            trackingUrl: `${SHIPWAY_TRACK_BASE}/${order.id}`,
            message: err.message
        };
    }
}

/**
 * Get tracking status or direct tracking link for an order
 */
export function getShipwayTrackingUrl(orderId) {
    return `${SHIPWAY_TRACK_BASE}/${encodeURIComponent(orderId)}`;
}
