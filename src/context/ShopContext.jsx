import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const API = 'http://localhost:5000/api';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {

    // ─── Tokens ──────────────────────────────────────────────────────────────
    const [accessToken,  setAccessToken]  = useState(() => sessionStorage.getItem('sahyadri_at')  || null);
    const [refreshToken, setRefreshToken] = useState(() => localStorage.getItem('sahyadri_rt')    || null);
    const refreshTimerRef = useRef(null);

    // Save tokens
    const saveTokens = (at, rt) => {
        setAccessToken(at);
        setRefreshToken(rt);
        if (at) sessionStorage.setItem('sahyadri_at', at);
        else     sessionStorage.removeItem('sahyadri_at');
        if (rt) localStorage.setItem('sahyadri_rt', rt);
        else     localStorage.removeItem('sahyadri_rt');
    };

    // Authenticated fetch helper — auto-attaches Bearer token
    const authFetch = useCallback(async (url, options = {}) => {
        const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
        return fetch(url, { ...options, headers });
    }, [accessToken]);

    // Silent token refresh (fires 1 min before 15-min expiry)
    const scheduleTokenRefresh = useCallback(() => {
        if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
        refreshTimerRef.current = setTimeout(async () => {
            if (!refreshToken) return;
            try {
                const res  = await fetch(`${API}/auth/refresh`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
                const data = await res.json();
                if (data.success) saveTokens(data.accessToken, refreshToken);
            } catch { /* silent — user will be asked to re-login on next protected action */ }
        }, 14 * 60 * 1000); // refresh after 14 minutes (token lasts 15)
    }, [refreshToken]);

    useEffect(() => {
        if (!accessToken && refreshToken) {
            fetch(`${API}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
            })
            .then(r => r.json())
            .then(data => {
                if (data.success && data.accessToken) {
                    saveTokens(data.accessToken, refreshToken);
                }
            })
            .catch(() => {});
        }
    }, [accessToken, refreshToken]);

    useEffect(() => {
        if (accessToken) scheduleTokenRefresh();
        return () => { if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current); };
    }, [accessToken]);

    // ─── Products ─────────────────────────────────────────────────────────────
    const [products, setProducts]           = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError]     = useState(null);

    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        setProductsError(null);
        try {
            const res  = await fetch(`${API}/products`);
            const json = await res.json();
            if (json.success) setProducts(json.data);
            else throw new Error(json.message);
        } catch (err) {
            setProductsError(err.message);
            const { PRODUCTS } = await import('../data/products.js');
            setProducts(PRODUCTS);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // ─── Cart ─────────────────────────────────────────────────────────────────
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_cart')) || []; } catch { return []; }
    });

    useEffect(() => { localStorage.setItem('sahyadri_cart', JSON.stringify(cart)); }, [cart]);

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id && i.weight === (product.weight || i.weight));
            if (existing) {
                return prev.map(i =>
                    i.id === product.id && i.weight === (product.weight || i.weight)
                        ? { ...i, quantity: i.quantity + (product.quantity || 1) }
                        : i
                );
            }
            return [...prev, {
                id: product.id, name: product.name, subname: product.subname,
                category: product.category, price: product.price,
                weight: product.weight || '100g', quantity: product.quantity || 1,
                image: product.image
            }];
        });
    };

    const updateQuantity = (id, newQty) => {
        if (newQty <= 0) removeFromCart(id);
        else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: newQty } : i));
    };

    const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
    const clearCart      = () => setCart([]);

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    // ─── Wishlist ─────────────────────────────────────────────────────────────
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_wishlist')) || []; } catch { return []; }
    });

    useEffect(() => { localStorage.setItem('sahyadri_wishlist', JSON.stringify(wishlist)); }, [wishlist]);

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    // ─── Auth ─────────────────────────────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_user')) || null; } catch { return null; }
    });

    const login = (userData, at = null, rt = null) => {
        setCurrentUser(userData);
        localStorage.setItem('sahyadri_user', JSON.stringify(userData));
        if (at && rt) saveTokens(at, rt);
    };

    const logout = async () => {
        // Revoke refresh token on backend
        if (refreshToken) {
            try {
                await fetch(`${API}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken }),
                });
            } catch { /* silent */ }
        }
        setCurrentUser(null);
        localStorage.removeItem('sahyadri_user');
        saveTokens(null, null);
    };

    const updateUserProfile = async (profileData) => {
        try {
            const res = await authFetch(`${API}/auth/profile`, {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });
            const data = await res.json();
            if (data.success && data.user) {
                const merged = { ...currentUser, ...data.user };
                setCurrentUser(merged);
                localStorage.setItem('sahyadri_user', JSON.stringify(merged));
                return { success: true, user: merged };
            }
            return { success: false, message: data.message || 'Failed to update profile' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const fetchUserOrders = async () => {
        try {
            const res = await authFetch(`${API}/orders/my-orders`);
            const data = await res.json();
            if (data.success) {
                return { success: true, data: data.data || [] };
            }
            return { success: false, message: data.message, data: [] };
        } catch (err) {
            return { success: false, message: err.message, data: [] };
        }
    };

    // ─── Production Product CRUD ──────────────────────────────────────────────
    const addProduct = async (productData) => {
        try {
            const res = await authFetch(`${API}/products`, {
                method: 'POST',
                body: JSON.stringify(productData)
            });
            const data = await res.json();
            if (data.success) {
                await fetchProducts();
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message || 'Failed to add product' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const updateProduct = async (id, productData) => {
        try {
            const res = await authFetch(`${API}/products/${id}`, {
                method: 'PUT',
                body: JSON.stringify(productData)
            });
            const data = await res.json();
            if (data.success) {
                await fetchProducts();
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message || 'Failed to update product' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await authFetch(`${API}/products/${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                await fetchProducts();
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message || 'Failed to delete product' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    // ─── Production Order CRUD ────────────────────────────────────────────────
    const createOrder = async (orderData) => {
        try {
            const res = await authFetch(`${API}/orders`, {
                method: 'POST',
                body: JSON.stringify(orderData)
            });
            const data = await res.json();
            if (data.success) {
                fetchProducts();
                return { success: true, data: data.data };
            }
            return { success: false, message: data.message || 'Failed to create order' };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const fetchAllOrders = async () => {
        try {
            const res = await authFetch(`${API}/orders`);
            const data = await res.json();
            if (data.success) return { success: true, data: data.data || [] };
            return { success: false, message: data.message, data: [] };
        } catch (err) {
            return { success: false, message: err.message, data: [] };
        }
    };

    const updateOrderStatus = async (orderId, status) => {
        try {
            const res = await authFetch(`${API}/orders/${orderId}/status`, {
                method: 'PATCH',
                body: JSON.stringify({ status })
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteOrder = async (orderId) => {
        try {
            const res = await authFetch(`${API}/orders/${orderId}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            return data;
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    // ─── Toast ────────────────────────────────────────────────────────────────
    const [toast, setToast] = useState('');
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <ShopContext.Provider value={{
            products, productsLoading, productsError, fetchProducts,
            addProduct, updateProduct, deleteProduct,
            cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal,
            wishlist, toggleWishlist,
            currentUser, login, logout, updateUserProfile, fetchUserOrders,
            createOrder, fetchAllOrders, updateOrderStatus, deleteOrder,
            toast, showToast,
            accessToken, authFetch,
            API,
        }}>
            {children}
        </ShopContext.Provider>
    );
}

export const useShop = () => {
    const ctx = useContext(ShopContext);
    if (!ctx) throw new Error('useShop must be used inside <ShopProvider>');
    return ctx;
};
