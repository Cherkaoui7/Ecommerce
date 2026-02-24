/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
    readonly VITE_USE_LOCAL_CATALOG?: string;
    readonly VITE_LOCAL_CATALOG_FALLBACK?: string;
    readonly VITE_GA_TRACKING_ID?: string;
    readonly VITE_SENTRY_DSN?: string;
    readonly VITE_SENTRY_ENVIRONMENT?: string;
    readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
    readonly VITE_SENTRY_ENABLE_IN_DEV?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
