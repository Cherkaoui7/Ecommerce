import { createContext, useContext } from 'react';

export type AdminSection =
    | 'dashboard'
    | 'products'
    | 'product-history'
    | 'categories'
    | 'orders'
    | 'users'
    | 'analytics';

interface AdminSectionContextValue {
    section: AdminSection;
    setSection: (section: AdminSection) => void;
}

export const AdminSectionContext = createContext<AdminSectionContextValue | undefined>(undefined);

export const useAdminSection = (): AdminSectionContextValue => {
    const context = useContext(AdminSectionContext);
    if (!context) {
        throw new Error('useAdminSection must be used within AdminSectionContext provider.');
    }

    return context;
};

