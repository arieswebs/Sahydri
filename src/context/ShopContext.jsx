import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API = 'http://localhost:5000/api';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
    // ─── Products ───────────────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);

    const fetchProducts = useCallback(async () => {
        setProductsLoading(true);
        setProductsError(null);
        try {
            const res = await fetch(`${API}/products`);
            const json = await res.json();
            if (json.success) setProducts(json.data);
            else throw new Error(json.message);
        } catch (err) {
            setProductsError(err.message);
            // Fallback to static data
            const { PRODUCTS } = await import('../data/products.js');
            setProducts(PRODUCTS);
        } finally {
            setProductsLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // ─── Cart ────────────────────────────────────────────────────────────────────
    const [cart, setCart] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_cart')) || []; } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('sahyadri_cart', JSON.stringify(cart));
    }, [cart]);

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

    const clearCart = () => setCart([]);

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    // ─── Wishlist ────────────────────────────────────────────────────────────────
    const [wishlist, setWishlist] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_wishlist')) || []; } catch { return []; }
    });

    useEffect(() => {
        localStorage.setItem('sahyadri_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (productId) => {
        setWishlist(prev =>
            prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
        );
    };

    // ─── Auth ────────────────────────────────────────────────────────────────────
    const [currentUser, setCurrentUser] = useState(() => {
        try { return JSON.parse(localStorage.getItem('sahyadri_user')) || null; } catch { return null; }
    });

    const login = (userData) => {
        setCurrentUser(userData);
        localStorage.setItem('sahyadri_user', JSON.stringify(userData));
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('sahyadri_user');
    };

    // ─── Toast ───────────────────────────────────────────────────────────────────
    const [toast, setToast] = useState('');
    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3000);
    };

    return (
        <ShopContext.Provider value={{
            products, productsLoading, productsError, fetchProducts,
            cart, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal,
            wishlist, toggleWishlist,
            currentUser, login, logout,
            toast, showToast,
            API
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
