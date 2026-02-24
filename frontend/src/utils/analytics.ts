import type { PurchaseItem, CartItem, ViewItemData } from '../types/analytics';

// Helper functions for tracking events
export const trackEvent = (action: string, category: string, label?: string, value?: number): void => {
    if (window.gtag) {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        });
    }
};

export const trackPurchase = (transactionId: string, value: number, items: PurchaseItem[]): void => {
    if (window.gtag) {
        window.gtag('event', 'purchase', {
            transaction_id: transactionId,
            value: value,
            currency: 'EUR',
            items: items,
        });
    }
};

export const trackAddToCart = (item: CartItem): void => {
    if (window.gtag) {
        window.gtag('event', 'add_to_cart', {
            currency: 'EUR',
            value: item.price * item.quantity,
            items: [{
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                quantity: item.quantity,
            }],
        });
    }
};

export const trackViewItem = (item: ViewItemData): void => {
    if (window.gtag) {
        window.gtag('event', 'view_item', {
            currency: 'EUR',
            value: item.price,
            items: [{
                item_id: item.id,
                item_name: item.name,
                price: item.price,
                item_category: item.category,
            }],
        });
    }
};
