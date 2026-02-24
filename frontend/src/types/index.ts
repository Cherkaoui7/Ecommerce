export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_active?: boolean;
}

export interface Product {
    id: number;
    category_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    price: string | number; // Laravel DB decimal often returns as string in JSON
    old_price: string | number | null;
    stock: number;
    is_active: boolean;
    sku: string | null;
    image_url: string | null;
    category?: Category;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: {
        current_page: number;
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: { url: string | null; label: string; active: boolean }[];
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}
