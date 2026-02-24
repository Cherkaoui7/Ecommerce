type ErrorReporter = (error: unknown, context?: Record<string, unknown>) => void;

declare global {
    interface Window {
        __APP_ERROR_REPORTER__?: ErrorReporter;
    }
}

export function reportError(error: unknown, context?: Record<string, unknown>): void {
    if (typeof window === 'undefined') {
        return;
    }

    const reporter = window.__APP_ERROR_REPORTER__;
    if (typeof reporter === 'function') {
        reporter(error, context);
    }
}

export default reportError;
