import httpClient from '../../api/httpClient';
import type { PaginatedResponse, Product } from '../../types';
import type { QueryParams } from '../../types/api';
import axios from 'axios';
import { LOCAL_PRODUCTS } from '../../data/localCatalog';

const PAGE_SIZE = 15;
const USE_LOCAL_CATALOG = import.meta.env.VITE_USE_LOCAL_CATALOG === 'true' || !import.meta.env.VITE_API_URL;
const ENABLE_LOCAL_CATALOG_FALLBACK = import.meta.env.VITE_LOCAL_CATALOG_FALLBACK !== 'false';

const localProductsSorted = [...LOCAL_PRODUCTS].sort((a, b) => b.id - a.id);

const isNetworkError = (error: unknown) => axios.isAxiosError(error) && !error.response;

const buildPaginationLinks = (currentPage: number, lastPage: number, basePath: string) => {
    const prevUrl = currentPage > 1 ? `${basePath}?page=${currentPage - 1}` : null;
    const nextUrl = currentPage < lastPage ? `${basePath}?page=${currentPage + 1}` : null;

    const pageLinks = Array.from({ length: lastPage }, (_, index) => {
        const pageNumber = index + 1;
        return {
            url: `${basePath}?page=${pageNumber}`,
            label: `${pageNumber}`,
            active: pageNumber === currentPage,
        };
    });

    return [
        { url: prevUrl, label: '&laquo; Previous', active: false },
        ...pageLinks,
        { url: nextUrl, label: 'Next &raquo;', active: false },
    ];
};

const getLocalProductsPaginated = (page = 1, categoryId?: number): PaginatedResponse<Product> => {
    const filtered = localProductsSorted.filter((product) => {
        if (categoryId && product.category_id !== categoryId) {
            return false;
        }

        return true;
    });

    const total = filtered.length;
    const perPage = PAGE_SIZE;
    const lastPage = Math.max(1, Math.ceil(total / perPage));
    const currentPage = Math.min(Math.max(page, 1), lastPage);
    const from = total === 0 ? 0 : (currentPage - 1) * perPage + 1;
    const to = total === 0 ? 0 : Math.min(currentPage * perPage, total);
    const data = total === 0 ? [] : filtered.slice(from - 1, to);
    const path = '/products';

    return {
        success: true,
        data: {
            current_page: currentPage,
            data,
            first_page_url: `${path}?page=1`,
            from,
            last_page: lastPage,
            last_page_url: `${path}?page=${lastPage}`,
            links: buildPaginationLinks(currentPage, lastPage, path),
            next_page_url: currentPage < lastPage ? `${path}?page=${currentPage + 1}` : null,
            path,
            per_page: perPage,
            prev_page_url: currentPage > 1 ? `${path}?page=${currentPage - 1}` : null,
            to,
            total,
        },
    };
};

const getLocalProductById = (id: number): Product | null => {
    const product = LOCAL_PRODUCTS.find((item) => item.id === id);
    return product ?? null;
};

export const fetchProducts = async (page = 1, categoryId?: number) => {
    if (USE_LOCAL_CATALOG) {
        return getLocalProductsPaginated(page, categoryId);
    }

    const params: QueryParams = { page };
    if (categoryId) params.category_id = categoryId;

    try {
        const response = await httpClient.get<PaginatedResponse<Product>>('/products', { params });
        return response.data;
    } catch (error: unknown) {
        if (ENABLE_LOCAL_CATALOG_FALLBACK && isNetworkError(error)) {
            return getLocalProductsPaginated(page, categoryId);
        }

        throw error;
    }
};

export const fetchProduct = async (id: number) => {
    if (USE_LOCAL_CATALOG) {
        const product = getLocalProductById(id);
        if (!product) {
            throw new Error('Product not found.');
        }

        return { success: true, data: product };
    }

    try {
        const response = await httpClient.get<{ success: boolean; data: Product }>(`/products/${id}`);
        return response.data;
    } catch (error: unknown) {
        if (ENABLE_LOCAL_CATALOG_FALLBACK && isNetworkError(error)) {
            const product = getLocalProductById(id);
            if (product) {
                return { success: true, data: product };
            }
        }

        throw error;
    }
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

