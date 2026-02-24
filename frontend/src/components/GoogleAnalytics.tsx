import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logger from '../utils/logger';

interface GoogleAnalyticsProps {
    trackingId?: string;
}

declare global {
    interface Window {
        gtag?: (command: string, ...args: unknown[]) => void;
        dataLayer?: unknown[];
    }
}

export default function GoogleAnalytics({ trackingId = import.meta.env.VITE_GA_TRACKING_ID }: GoogleAnalyticsProps) {
    const location = useLocation();

    useEffect(() => {
        if (!trackingId) {
            logger.warn('Google Analytics tracking ID not provided');
            return;
        }

        // Load Google Analytics script
        const script1 = document.createElement('script');
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.innerHTML = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackingId}', {
                page_path: window.location.pathname,
            });
        `;
        document.head.appendChild(script2);

        return () => {
            document.head.removeChild(script1);
            document.head.removeChild(script2);
        };
    }, [trackingId]);

    // Track page views
    useEffect(() => {
        if (window.gtag) {
            window.gtag('config', trackingId, {
                page_path: location.pathname + location.search,
            });
        }
    }, [location, trackingId]);

    return null;
}
