import { useEffect, useState, useCallback } from 'react';
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import type { Notification, NotificationType } from '../../context/NotificationContext';

interface ToastProps {
    notification: Notification;
    onClose: (id: string) => void;
}

const typeConfig: Record<NotificationType, {
    wrapper: string;
    icon: React.ReactNode;
    progressBar: string;
    iconWrapper: string;
}> = {
    success: {
        wrapper: 'bg-white dark:bg-gray-900 border border-green-200 dark:border-green-500/30 shadow-green-100/60 dark:shadow-green-900/20',
        icon: <CheckCircleIcon className="h-5 w-5 text-white" />,
        iconWrapper: 'bg-green-500',
        progressBar: 'bg-green-500',
    },
    error: {
        wrapper: 'bg-white dark:bg-gray-900 border border-red-200 dark:border-red-500/30 shadow-red-100/60 dark:shadow-red-900/20',
        icon: <XCircleIcon className="h-5 w-5 text-white" />,
        iconWrapper: 'bg-red-500',
        progressBar: 'bg-red-500',
    },
    warning: {
        wrapper: 'bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-500/30 shadow-amber-100/60 dark:shadow-amber-900/20',
        icon: <ExclamationTriangleIcon className="h-5 w-5 text-white" />,
        iconWrapper: 'bg-amber-500',
        progressBar: 'bg-amber-500',
    },
    info: {
        wrapper: 'bg-white dark:bg-gray-900 border border-blue-200 dark:border-blue-500/30 shadow-blue-100/60 dark:shadow-blue-900/20',
        icon: <InformationCircleIcon className="h-5 w-5 text-white" />,
        iconWrapper: 'bg-blue-500',
        progressBar: 'bg-blue-500',
    },
};

export default function Toast({ notification, onClose }: ToastProps) {
    const { id, type, title, message, duration } = notification;
    const config = typeConfig[type];
    const [exiting, setExiting] = useState(false);
    const [progress, setProgress] = useState(100);

    const handleClose = useCallback(() => {
        setExiting(true);
        setTimeout(() => onClose(id), 320);
    }, [id, onClose]);

    useEffect(() => {
        if (!duration || duration <= 0) return;

        // Progress bar countdown
        const interval = setInterval(() => {
            setProgress((prev) => {
                const next = prev - (100 / (duration / 50));
                return next <= 0 ? 0 : next;
            });
        }, 50);

        // Auto-close
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
        };
    }, [duration, handleClose]);

    return (
        <div
            className={`
                w-[360px] pointer-events-auto rounded-2xl shadow-xl overflow-hidden
                ${config.wrapper}
                ${exiting ? 'animate-toast-out' : 'animate-toast-in'}
            `}
        >
            <div className="flex items-start gap-3 px-4 pt-4 pb-3">
                {/* Icon badge */}
                <div className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl ${config.iconWrapper} shadow-sm`}>
                    {config.icon}
                </div>

                {/* Text content */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white leading-tight">{title}</p>
                    {message && (
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 leading-snug">{message}</p>
                    )}
                </div>

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="flex-shrink-0 mt-0.5 p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-150"
                    aria-label="Close notification"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>

            {/* Progress bar */}
            {duration && duration > 0 && (
                <div className="h-[3px] w-full bg-gray-100 dark:bg-gray-800">
                    <div
                        className={`h-full ${config.progressBar} transition-none rounded-full`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}
        </div>
    );
}
