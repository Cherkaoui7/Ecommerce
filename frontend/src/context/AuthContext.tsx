/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/auth';
import { fetchUser, logout as apiLogout } from '../features/auth/authApi';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
    downloadInvoice: (orderId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const response = await fetchUser();
            setUser(response.data);
        } catch {
            setUser(null);
            localStorage.removeItem('auth_token');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const logout = async () => {
        try {
            await apiLogout();
        } catch (e) {
            console.error(e);
            // fallback clear
            localStorage.removeItem('auth_token');
        }
        setUser(null);
    };

    const downloadInvoice = async (orderId: number) => {
        const token = localStorage.getItem('auth_token');
        const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
        
        const response = await fetch(`${baseUrl}/api/orders/${orderId}/invoice/download`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Erreur lors du téléchargement' }));
            throw new Error(error.message || 'Erreur lors du téléchargement');
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `facture-${orderId}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, setUser, logout, checkAuth, downloadInvoice }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
