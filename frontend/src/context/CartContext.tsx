/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useNotification } from './NotificationContext';

export interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_VERSION = '3'; // bump this whenever the Product schema changes

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { success, info } = useNotification();
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const version = localStorage.getItem('cart_version');
            if (version !== CART_VERSION) {
                // Stale cart — clear it so users get fresh product data
                localStorage.removeItem('cart');
                localStorage.setItem('cart_version', CART_VERSION);
                return [];
            }
            const saved = localStorage.getItem('cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addToCart = (product: Product, quantity: number) => {
        const existing = items.find(item => item.product.id === product.id);
        if (existing) {
            success('Panier mis à jour', `${quantity} x ${product.name} ajouté(s) au panier`);
        } else {
            success('Ajouté au panier', `${quantity} x ${product.name} ajouté(s) avec succès`);
        }
        setItems(current => {
            if (current.find(item => item.product.id === product.id)) {
                return current.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...current, { product, quantity }];
        });
    };

    const removeFromCart = (productId: number) => {
        const item = items.find(i => i.product.id === productId);
        if (item) {
            info('Produit retiré', `${item.product.name} a été retiré du panier`);
        }
        setItems(current => current.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        setItems(current =>
            current.map(item =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        if (items.length > 0) {
            info('Panier vidé', 'Tous les produits ont été retirés du panier');
        }
        setItems([]);
    };

    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = items.reduce((total, item) => {
        const price = typeof item.product.price === 'string' ? parseFloat(item.product.price) : item.product.price;
        return total + (price * item.quantity);
    }, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
