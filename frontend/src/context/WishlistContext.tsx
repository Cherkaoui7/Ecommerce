/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: number) => void;
    isInWishlist: (productId: number) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>(() => {
        const storedWishlist = localStorage.getItem('nexus_wishlist');
        if (!storedWishlist) {
            return [];
        }

        try {
            return JSON.parse(storedWishlist);
        } catch (e) {
            console.error("Failed to parse wishlist from local storage", e);
            return [];
        }
    });

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find(p => p.id === product.id)) return prev;
            const newWishlist = [...prev, product];
            localStorage.setItem('nexus_wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const removeFromWishlist = (productId: number) => {
        setWishlist((prev) => {
            const newWishlist = prev.filter(p => p.id !== productId);
            localStorage.setItem('nexus_wishlist', JSON.stringify(newWishlist));
            return newWishlist;
        });
    };

    const isInWishlist = (productId: number) => {
        return wishlist.some(p => p.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
