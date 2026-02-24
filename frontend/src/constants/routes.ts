const DEFAULT_ADMIN_PATH = '/control-room';

const rawAdminPath = (import.meta.env.VITE_ADMIN_PATH || DEFAULT_ADMIN_PATH).trim();
const withLeadingSlash = rawAdminPath.startsWith('/') ? rawAdminPath : `/${rawAdminPath}`;
const normalizedAdminPath = withLeadingSlash.replace(/\/+$/, '') || DEFAULT_ADMIN_PATH;

export const ADMIN_ROUTE_PREFIX = normalizedAdminPath;
