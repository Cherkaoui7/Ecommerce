/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../types';
import { useNotification } from './NotificationContext';

interface ComparisonContextType {
    items: Product[];
    addToComparison: (product: Product) => void;
    removeFromComparison: (productId: number) => void;
    clearComparison: () => void;
    isInComparison: (productId: number) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

const MAX_COMPARISON_ITEMS = 4;

export const ComparisonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { success, warning, info } = useNotification();
    const [items, setItems] = useState<Product[]>(() => {
        try {
            const saved = localStorage.getItem('comparison');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('comparison', JSON.stringify(items));
    }, [items]);

    const addToComparison = (product: Product) => {
        setItems(current => {
            if (current.find(item => item.id === product.id)) {
                warning('Déjà en comparaison', `${product.name} est déjà dans votre comparateur`);
                return current;
            }
            
            if (current.length >= MAX_COMPARISON_ITEMS) {
                warning('Limite atteinte', `Vous ne pouvez comparer que ${MAX_COMPARISON_ITEMS} produits maximum`);
                return current;
            }
            
            success('Ajouté au comparateur', `${product.name} a été ajouté à la comparaison`);
            return [...current, product];
        });
    };

    const removeFromComparison = (productId: number) => {
        const item = items.find(p => p.id === productId);
        if (item) {
            info('Produit retiré', `${item.name} a été retiré de la comparaison`);
        }
        setItems(current => current.filter(item => item.id !== productId));
    };

    const clearComparison = () => {
        if (items.length > 0) {
            info('Comparaison effacée', 'Tous les produits ont été retirés de la comparaison');
        }
        setItems([]);
    };

    const isInComparison = (productId: number) => {
        return items.some(item => item.id === productId);
    };

    return (
        <ComparisonContext.Provider value={{ items, addToComparison, removeFromComparison, clearComparison, isInComparison }}>
            {children}
        </ComparisonContext.Provider>
    );
};

export const useComparison = () => {
    const context = useContext(ComparisonContext);
    if (context === undefined) {
        throw new Error('useComparison must be used within a ComparisonProvider');
    }
    return context;
};
