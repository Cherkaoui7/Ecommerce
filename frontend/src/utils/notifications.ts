/**
 * Browser Push Notification Utilities
 */

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
        // Browser doesn't support notifications - return denied
        return 'denied';
    }

    if (Notification.permission === 'granted') {
        return 'granted';
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission;
    }

    return Notification.permission;
};

export const showBrowserNotification = (title: string, options?: NotificationOptions) => {
    if (!('Notification' in window)) {
        // Browser doesn't support notifications - silent fail
        return;
    }

    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/vite.svg',
            badge: '/vite.svg',
            ...options,
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
            if (permission === 'granted') {
                new Notification(title, {
                    icon: '/vite.svg',
                    badge: '/vite.svg',
                    ...options,
                });
            }
        });
    }
};

export const notifyOrderPlaced = (orderNumber: string) => {
    showBrowserNotification('Commande Confirmée', {
        body: `Votre commande #${orderNumber} a été enregistrée avec succès !`,
        tag: 'order-placed',
        requireInteraction: false,
    });
};

export const notifyOrderStatusUpdate = (orderNumber: string, status: string) => {
    const statusMessages: Record<string, string> = {
        paid: 'Paiement confirmé',
        processing: 'En cours de préparation',
        shipped: 'Expédiée',
        completed: 'Livrée',
        cancelled: 'Annulée',
    };

    showBrowserNotification('Mise à jour de commande', {
        body: `Commande #${orderNumber}: ${statusMessages[status] || status}`,
        tag: 'order-update',
        requireInteraction: false,
    });
};

export const notifyLowStock = (productName: string, stock: number) => {
    showBrowserNotification('Alerte Stock Bas', {
        body: `${productName} - Stock restant: ${stock} unité(s)`,
        tag: 'low-stock',
        requireInteraction: true,
    });
};

export const checkNotificationSupport = (): boolean => {
    return 'Notification' in window;
};

export const getNotificationPermissionStatus = (): NotificationPermission => {
    if (!('Notification' in window)) {
        return 'denied';
    }
    return Notification.permission;
};
