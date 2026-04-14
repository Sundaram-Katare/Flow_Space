const env = require('../config/env');

function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...(data && { data }),
  };
  
  if (level === 'error') {
    console.error(`❌ [${timestamp}] ${message}`, data);
  } else if (level === 'warn') {
    console.warn(`⚠️  [${timestamp}] ${message}`, data);
  } else if (level === 'info') {
    console.log(`ℹ️  [${timestamp}] ${message}`, data);
  }
}

module.exports = {
  info: (msg, data) => log('info', msg, data),
  warn: (msg, data) => log('warn', msg, data),
  error: (msg, data) => log('error', msg, data),
};