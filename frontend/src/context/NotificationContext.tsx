/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { requestNotificationPermission, showBrowserNotification, checkNotificationSupport } from '../utils/notifications';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    removeNotification: (id: string) => void;
    success: (title: string, message: string, duration?: number, showBrowser?: boolean) => void;
    error: (title: string, message: string, duration?: number, showBrowser?: boolean) => void;
    warning: (title: string, message: string, duration?: number, showBrowser?: boolean) => void;
    info: (title: string, message: string, duration?: number, showBrowser?: boolean) => void;
    requestBrowserPermission: () => Promise<NotificationPermission>;
    browserNotificationsEnabled: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(() => {
        if (!checkNotificationSupport()) {
            return false;
        }

        return Notification.permission === 'granted';
    });

    const removeNotification = useCallback((id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        const newNotification: Notification = {
            ...notification,
            id,
            duration: notification.duration ?? 5000,
        };

        setNotifications((prev) => [...prev, newNotification]);

        const duration = newNotification.duration ?? 0;

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    const requestBrowserPermission = useCallback(async () => {
        const permission = await requestNotificationPermission();
        setBrowserNotificationsEnabled(permission === 'granted');
        return permission;
    }, []);

    const success = useCallback((title: string, message: string, duration?: number, showBrowser = false) => {
        addNotification({ type: 'success', title, message, duration });
        if (showBrowser && browserNotificationsEnabled) {
            showBrowserNotification(title, { body: message });
        }
    }, [addNotification, browserNotificationsEnabled]);

    const error = useCallback((title: string, message: string, duration?: number, showBrowser = false) => {
        addNotification({ type: 'error', title, message, duration });
        if (showBrowser && browserNotificationsEnabled) {
            showBrowserNotification(title, { body: message });
        }
    }, [addNotification, browserNotificationsEnabled]);

    const warning = useCallback((title: string, message: string, duration?: number, showBrowser = false) => {
        addNotification({ type: 'warning', title, message, duration });
        if (showBrowser && browserNotificationsEnabled) {
            showBrowserNotification(title, { body: message });
        }
    }, [addNotification, browserNotificationsEnabled]);

    const info = useCallback((title: string, message: string, duration?: number, showBrowser = false) => {
        addNotification({ type: 'info', title, message, duration });
        if (showBrowser && browserNotificationsEnabled) {
            showBrowserNotification(title, { body: message });
        }
    }, [addNotification, browserNotificationsEnabled]);

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                addNotification,
                removeNotification,
                success,
                error,
                warning,
                info,
                requestBrowserPermission,
                browserNotificationsEnabled,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
}
