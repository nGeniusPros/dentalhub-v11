/**
 * NexHealth Logger
 * 
 * A specialized logger for NexHealth integration that provides structured logging
 * with context information and different log levels.
 */

// Log levels
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
  error?: any;
}

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  includeTimestamp: boolean;
  destinations: LogDestination[];
  defaultContext?: Record<string, any>;
}

// Log destination interface
export interface LogDestination {
  log(entry: LogEntry): void;
}

// Console log destination
export class ConsoleLogDestination implements LogDestination {
  log(entry: LogEntry): void {
    const timestamp = entry.timestamp ? `[${entry.timestamp}] ` : '';
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(`${timestamp}${entry.level.toUpperCase()}: ${entry.message}${context}`);
        break;
      case LogLevel.INFO:
        console.info(`${timestamp}${entry.level.toUpperCase()}: ${entry.message}${context}`);
        break;
      case LogLevel.WARN:
        console.warn(`${timestamp}${entry.level.toUpperCase()}: ${entry.message}${context}`);
        break;
      case LogLevel.ERROR:
        console.error(`${timestamp}${entry.level.toUpperCase()}: ${entry.message}${context}`);
        if (entry.error) {
          if (entry.error.stack) {
            console.error(entry.error.stack);
          } else {
            console.error(entry.error);
          }
        }
        break;
    }
  }
}

// File log destination
export class FileLogDestination implements LogDestination {
  private filePath: string;
  private fs: any;

  constructor(filePath: string) {
    this.filePath = filePath;
    // Dynamically import fs to avoid issues in browser environments
    try {
      this.fs = require('fs');
    } catch (e) {
      console.error('FileLogDestination: fs module not available');
    }
  }

  log(entry: LogEntry): void {
    if (!this.fs) return;

    try {
      const line = JSON.stringify({
        timestamp: entry.timestamp,
        level: entry.level,
        message: entry.message,
        context: entry.context || {},
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack,
          ...entry.error
        } : undefined
      }) + '\n';

      this.fs.appendFileSync(this.filePath, line);
    } catch (error) {
      console.error('Error writing to log file:', error);
    }
  }
}

// Default configuration
const DEFAULT_CONFIG: LoggerConfig = {
  minLevel: LogLevel.INFO,
  includeTimestamp: true,
  destinations: [new ConsoleLogDestination()]
};

export class NexHealthLogger {
  private config: LoggerConfig;
  private contextData: Record<string, any>;

  constructor(config: Partial<LoggerConfig> = {}, context: Record<string, any> = {}) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
      defaultContext: {
        ...DEFAULT_CONFIG.defaultContext,
        ...config.defaultContext
      }
    };
    this.contextData = { ...this.config.defaultContext, ...context };
  }

  /**
   * Create a new logger instance with additional context
   */
  withContext(context: Record<string, any>): NexHealthLogger {
    return new NexHealthLogger(this.config, { ...this.contextData, ...context });
  }

  /**
   * Log a message at DEBUG level
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log a message at INFO level
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a message at WARN level
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log a message at ERROR level
   */
  error(message: string, error?: any, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a message at the specified level
   */
  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: any): void {
    // Skip if below minimum log level
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      timestamp: this.config.includeTimestamp ? new Date().toISOString() : '',
      level,
      message,
      context: { ...this.contextData, ...context },
      error
    };

    // Send to all destinations
    for (const destination of this.config.destinations) {
      try {
        destination.log(entry);
      } catch (err) {
        console.error('Error logging to destination:', err);
      }
    }
  }

  /**
   * Check if the given log level should be logged
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const minLevelIndex = levels.indexOf(this.config.minLevel);
    const currentLevelIndex = levels.indexOf(level);
    
    return currentLevelIndex >= minLevelIndex;
  }
}

// Create a default instance
export const nexhealthLogger = new NexHealthLogger();

export default nexhealthLogger;
