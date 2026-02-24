import httpClient from '../../api/httpClient';
import type { ApiResponse } from '../../types/api';
import type { Order, OrderAddressInput } from '../../types/order';

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

export const createOrder = async (orderData: OrderPayload) => {
    const response = await httpClient.post<ApiResponse<Order>>('/orders', orderData);
    return response.data;
};

export const fetchOrders = async () => {
    const response = await httpClient.get<ApiResponse<Order[]>>('/orders');
    return response.data;
};
