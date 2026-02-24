import * as Sentry from '@sentry/react';

let isInitialized = false;

function parseRate(value: string | undefined, fallback: number): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
        return fallback;
    }

    if (parsed < 0) {
        return 0;
    }

    if (parsed > 1) {
        return 1;
    }

    return parsed;
}

export function initSentry(): void {
    if (isInitialized || typeof window === 'undefined') {
        return;
    }

    const dsn = import.meta.env.VITE_SENTRY_DSN;
    if (!dsn) {
        return;
    }

    const enableInDev = import.meta.env.VITE_SENTRY_ENABLE_IN_DEV === 'true';
    if (import.meta.env.DEV && !enableInDev) {
        return;
    }

    Sentry.init({
        dsn,
        environment: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
        tracesSampleRate: parseRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
    });

    window.__APP_ERROR_REPORTER__ = (error, context) => {
        Sentry.captureException(error, {
            extra: context,
        });
    };

    isInitialized = true;
}

export default initSentry;
