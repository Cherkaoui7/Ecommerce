import type { Product } from './index';

export interface OrderAddressInput {
    fullName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
}

export interface OrderAddress {
    fullName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
    country?: string;
    [key: string]: string | undefined;
}

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    product_name_snapshot: string;
    unit_price: string | number;
    quantity: number;
    line_total: string | number;
    product?: Product | null;
}

export interface Order {
    id: number;
    user_id: number;
    status: string;
    total: string | number;
    payment_method: string | null;
    payment_status: string;
    created_at: string;
    updated_at: string;
    shipping_address?: OrderAddress | null;
    billing_address?: OrderAddress | null;
    items: OrderItem[];
    user?: {
        id: number;
        name: string;
        email: string;
        role: string;
    } | null;
}
