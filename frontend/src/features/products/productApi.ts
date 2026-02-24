import httpClient from '../../api/httpClient';
import type { PaginatedResponse, Product } from '../../types';
import type { QueryParams } from '../../types/api';

export const fetchProducts = async (page = 1, categoryId?: number) => {
    const params: QueryParams = { page };
    if (categoryId) params.category_id = categoryId;

    const response = await httpClient.get<PaginatedResponse<Product>>('/products', { params });
    return response.data;
};

export const fetchProduct = async (id: number) => {
    const response = await httpClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
    return response.data;
};

export const createProduct = async (data: FormData | Partial<Product>) => {
    const response = await httpClient.post<{ success: boolean; data: Product }>('/products', data);
    return response.data;
};

export const updateProduct = async (id: number, data: FormData | Partial<Product>) => {
    // Laravel requires _method=PUT when sending FormData via POST
    if (data instanceof FormData) {
        data.append('_method', 'PUT');
        const response = await httpClient.post<{ success: boolean; data: Product }>(`/products/${id}`, data);
        return response.data;
    } else {
        const response = await httpClient.put<{ success: boolean; data: Product }>(`/products/${id}`, data);
        return response.data;
    }
};

export const deleteProduct = async (id: number) => {
    const response = await httpClient.delete(`/products/${id}`);
    return response.data;
};

export interface BulkUpdatePayload {
    product_ids: number[];
    price?: number;
    stock_action?: 'set' | 'add' | 'subtract';
    stock_value?: number;
    category_id?: number | null;
    is_active?: boolean;
}

export const bulkUpdateProducts = async (payload: BulkUpdatePayload) => {
    const response = await httpClient.patch<{ success: boolean; message: string; updated: number }>('/products/bulk', payload);
    return response.data;
};

export interface ProductHistoryEntry {
    id: number;
    product_id: number | null;
    user_id: number | null;
    action: 'created' | 'updated' | 'deleted' | 'bulk_update';
    old_values: Record<string, unknown> | null;
    new_values: Record<string, unknown> | null;
    description: string | null;
    created_at: string;
    product: { id: number; name: string; image_url: string | null } | null;
    user: { id: number; name: string } | null;
}

export interface ProductHistoryStats {
    total: number;
    today: number;
    this_week: number;
}

export type ProductHistoryResponse = PaginatedResponse<ProductHistoryEntry> & {
    stats?: ProductHistoryStats;
};

export const fetchProductHistory = async (params?: QueryParams) => {
    const response = await httpClient.get<ProductHistoryResponse>('/product-history', { params });
    return response.data;
};

