import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type { Order, OrderAddressInput } from '../../types/order';
import type { Product } from '../../types';

export interface OrderPayload {
    products: {
        id: number;
        quantity: number;
        price: number;
    }[];
    shipping_address: OrderAddressInput;
    billing_address: OrderAddressInput;
    payment_method?: string;
}

const LOCAL_MODE = !import.meta.env.VITE_API_URL;
const LOCAL_ORDERS_KEY = 'local_demo_orders';
const LOCAL_USERS_KEY = 'local_auth_users';
const LOCAL_ACTIVE_USER_KEY = 'local_auth_active_user_id';
const LOCAL_TOKEN_PREFIX = 'local-demo-token-';

const readLocalOrders = (): Order[] => {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (!raw) return [];
    try {
        const parsed = JSON.parse(raw) as Order[];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

const writeLocalOrders = (orders: Order[]) => {
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify(orders));
};

const resolveCurrentUserId = (): number => {
    const active = Number(localStorage.getItem(LOCAL_ACTIVE_USER_KEY) || 0);
    if (active > 0) return active;
    const token = localStorage.getItem('auth_token') || '';
    if (token.startsWith(LOCAL_TOKEN_PREFIX)) {
        const id = Number(token.slice(LOCAL_TOKEN_PREFIX.length));
        if (id > 0) return id;
    }
    return 0;
};

const resolveCurrentUserRole = (): string => {
    const usersRaw = localStorage.getItem(LOCAL_USERS_KEY);
    if (!usersRaw) return 'customer';
    try {
        const users = JSON.parse(usersRaw) as Array<{ id: number; role?: string }>;
        const currentUserId = resolveCurrentUserId();
        return users.find((u) => u.id === currentUserId)?.role || 'customer';
    } catch {
        return 'customer';
    }
};

const buildLocalOrder = (orderData: OrderPayload): Order => {
    const now = new Date().toISOString();
    const existing = readLocalOrders();
    const nextId = existing.reduce((maxId, order) => Math.max(maxId, order.id), 0) + 1;

    const items = orderData.products.map((item, idx) => {
        const unitPrice = Number(item.price);
        return {
            id: idx + 1,
            order_id: nextId,
            product_id: item.id,
            product_name_snapshot: `Produit #${item.id}`,
            unit_price: unitPrice,
            quantity: item.quantity,
            line_total: unitPrice * item.quantity,
            product: null as Product | null,
        };
    });

    return {
        id: nextId,
        user_id: resolveCurrentUserId() || 1,
        status: 'pending',
        total: items.reduce((sum, item) => sum + Number(item.line_total), 0),
        payment_method: orderData.payment_method || 'demo_card',
        payment_status: 'paid',
        created_at: now,
        updated_at: now,
        shipping_address: orderData.shipping_address as Order['shipping_address'],
        billing_address: orderData.billing_address as Order['billing_address'],
        items,
        user: null,
    };
};

export const createOrder = async (orderData: OrderPayload) => {
    if (LOCAL_MODE) {
        const order = buildLocalOrder(orderData);
        const existing = readLocalOrders();
        writeLocalOrders([order, ...existing]);
        return {
            success: true,
            data: order,
            message: 'Commande en mode demo (localStorage).',
        } as ApiResponse<Order>;
    }

    const response = await httpClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
};

export const fetchOrders = async () => {
    if (LOCAL_MODE) {
        const allOrders = readLocalOrders();
        const role = resolveCurrentUserRole();
        const currentUserId = resolveCurrentUserId();
        const data =
            role === 'admin'
                ? allOrders
                : allOrders.filter((order) => order.user_id === currentUserId);
        return {
            success: true,
            data,
            message: 'Commandes chargees depuis localStorage (mode demo).',
        } as ApiResponse<Order[]>;
    }

    const response = await httpClient.get<ApiResponse<Order[]>>('/orders');
    return response.data;
};
