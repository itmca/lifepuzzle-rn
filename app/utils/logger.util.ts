/**
 * Environment-aware logger for React Native
 *
 * - debug/info: Only in development (__DEV__)
 * - warn/error: Always logged (important for production debugging)
 *
 * __DEV__ is set at build time by React Native, so debug/info calls
 * are completely removed from production bundles (dead code elimination).
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface Logger {
  /** Debug logs - development only, removed from production bundle */
  debug: (...args: unknown[]) => void;
  /** Info logs - development only, removed from production bundle */
  info: (...args: unknown[]) => void;
  /** Warning logs - always logged */
  warn: (...args: unknown[]) => void;
  /** Error logs - always logged */
  error: (...args: unknown[]) => void;
  /** Log with explicit level */
  log: (level: LogLevel, ...args: unknown[]) => void;
}

const logger: Logger = {
  debug: (...args: unknown[]) => {
    if (__DEV__) {
      console.log('[DEBUG]', ...args);
    }
  },

  info: (...args: unknown[]) => {
    if (__DEV__) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
  },

  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
  },

  log: (level: LogLevel, ...args: unknown[]) => {
    switch (level) {
      case 'debug':
        logger.debug(...args);
        break;
      case 'info':
        logger.info(...args);
        break;
      case 'warn':
        logger.warn(...args);
        break;
      case 'error':
        logger.error(...args);
        break;
    }
  },
};

export { logger };
