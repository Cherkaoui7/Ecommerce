import httpClient from '../../api/httpClient';
import type { Category } from '../../types';

export const fetchCategories = async () => {
    const response = await httpClient.get<{ success: boolean; data: Category[] }>('/categories');
    return response.data;
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
