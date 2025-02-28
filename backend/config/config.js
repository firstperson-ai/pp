// backend/config/config.js
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const config = {
  port: parseInt(process.env.PORT || process.env.BACKEND_PORT || (env === 'production' ? '8080' : '3000'), 10),
  backendUrl: process.env.BACKEND_URL || (env === 'production' ? 'https://your-backend-domain.com' : 'http://localhost'),
  pythonScriptPath: 'backend/services',
  redisUrl: process.env.REDIS_URL || (env === 'production' ? 'redis://your-redis-host:6379' : 'redis://localhost:6379'),
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: env === 'production' ? 5000 : 100, // Higher limit in production, lower locally
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || (env === 'production' ? 'https://your-frontend-domain.com' : 'http://localhost:3000')).split(','),
  websocketPort: parseInt(process.env.WEBSOCKET_PORT || '3002', 10),
  prometheusPort: parseInt(process.env.PROMETHEUS_PORT || '9091', 10),
  cacheTTL: 24 * 60 * 60, // 24 hours cache TTL
  localFallback: env === 'development', // Flag for local simplifications
};

module.exports = config;