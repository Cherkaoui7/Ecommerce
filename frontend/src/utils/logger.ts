import reportError from './errorReporter';

/**
 * Logger utility for production-safe logging
 * Only logs in development mode, silent in production
 */

const isDevelopment = import.meta.env.MODE === 'development';

export const logger = {
  log: (): void => {
    // Intentionally no-op: keep API surface without console spam.
  },

  warn: (...args: unknown[]): void => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  error: (...args: unknown[]): void => {
    // Always log errors, even in production
    console.error(...args);
    
    // In production, forward to optional app-level reporter hook.
    if (!isDevelopment) {
      reportError(args[0], {
        source: 'logger',
        extra: args.slice(1),
      });
    }
  },

  debug: (): void => {
    // Intentionally no-op: use explicit instrumentation when needed.
  },
};

export default logger;
