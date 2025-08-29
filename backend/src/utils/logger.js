const winston = require('winston');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = process.env.LOG_FILE_PATH ? path.dirname(process.env.LOG_FILE_PATH) : './data/logs';

// Log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
  })
);

// Create logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ]
});

// Add file transport in production
if (process.env.NODE_ENV === 'production' && process.env.LOG_FILE_PATH) {
  logger.add(new winston.transports.File({
    filename: process.env.LOG_FILE_PATH,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }));
}

// Add error file in production
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    maxsize: 5242880,
    maxFiles: 5,
  }));
}

module.exports = logger;