import httpClient from '../../api/httpClient';
import type { Category } from '../../types';
import axios from 'axios';
import { LOCAL_CATEGORIES } from '../../data/localCatalog';

const USE_LOCAL_CATALOG = import.meta.env.VITE_USE_LOCAL_CATALOG === 'true' || !import.meta.env.VITE_API_URL;
const ENABLE_LOCAL_CATALOG_FALLBACK = import.meta.env.VITE_LOCAL_CATALOG_FALLBACK !== 'false';

const getLocalCategories = (): Category[] => {
    return LOCAL_CATEGORIES.filter((category) => category.is_active !== false);
};

export const fetchCategories = async () => {
    if (USE_LOCAL_CATALOG) {
        return { success: true, data: getLocalCategories() };
    }

    try {
        const response = await httpClient.get<{ success: boolean; data: Category[] }>('/categories');
        return response.data;
    } catch (error: unknown) {
        if (ENABLE_LOCAL_CATALOG_FALLBACK && axios.isAxiosError(error) && !error.response) {
            return { success: true, data: getLocalCategories() };
        }

        throw error;
    }
};

export const createCategory = async (data: Partial<Category>) => {
    const response = await httpClient.post<{ success: boolean; data: Category }>('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: Partial<Category>) => {
    const response = await httpClient.put<{ success: boolean; data: Category }>(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    const response = await httpClient.delete(`/categories/${id}`);
    return response.data;
};
