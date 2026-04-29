/**
 * Simple structured logger
 * Uses console in development, JSON in production
 */

const isProduction = process.env.NODE_ENV === 'production'

// Simple logger compatible with Next.js
const createLogger = () => {
  const log = (level: string, msg: string, obj?: Record<string, unknown>) => {
    const timestamp = new Date().toISOString()
    if (isProduction) {
      // Production: JSON format
      console.log(JSON.stringify({ level, time: timestamp, msg, ...obj }))
    } else {
      // Development: Pretty format
      const color = {
        error: '\x1b[31m',
        warn: '\x1b[33m',
        info: '\x1b[36m',
        debug: '\x1b[35m',
      }[level] || ''
      const reset = '\x1b[0m'
      console.log(`${color}[${level.toUpperCase()}]${reset} ${timestamp} - ${msg}`, obj || '')
    }
  }

  return {
    error: (obj: Record<string, unknown>) => log('error', obj.msg as string, obj),
    warn: (obj: Record<string, unknown>) => log('warn', obj.msg as string, obj),
    info: (obj: Record<string, unknown>) => log('info', obj.msg as string, obj),
    debug: (obj: Record<string, unknown>) => log('debug', obj.msg as string, obj),
  }
}

export const logger = createLogger()

// Helper functions for common log patterns
export const logError = (message: string, error?: Error | unknown, context?: Record<string, unknown>) => {
  logger.error({
    msg: message,
    error: error instanceof Error ? error.message : error,
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  })
}

export const logWarn = (message: string, context?: Record<string, unknown>) => {
  logger.warn({ msg: message, ...context })
}

export const logInfo = (message: string, context?: Record<string, unknown>) => {
  logger.info({ msg: message, ...context })
}

export const logDebug = (message: string, context?: Record<string, unknown>) => {
  logger.debug({ msg: message, ...context })
}
