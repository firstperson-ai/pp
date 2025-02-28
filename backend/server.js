// backend/server.js
require('dotenv').config();
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { Server } = require('ws');
const { createClient } = require('redis');
const promClient = require('prom-client');
const config = require('./config/config');
const optimizeResumeRoute = require('./routes/optimize-resume');

// Prometheus metrics registry
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  // Fork workers: full scaling in production, 1 worker locally
  const numWorkers = config.localFallback ? 1 : numCPUs;
  for (let i = 0; i < numWorkers; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork(); // Auto-restart failed workers
  });
} else {
  const app = express();

  // Redis client for caching (with fallback for local)
  let redisClient = null;
  try {
    redisClient = createClient({ url: config.redisUrl });
    redisClient.on('error', (err) => {
      if (config.localFallback) {
        console.warn('Redis not available locally, falling back to in-memory caching:', err);
        redisClient = null; // Disable Redis locally if unavailable
      } else {
        throw err; // Fail in production if Redis isn’t available
      }
    });
    redisClient.connect().catch(console.error);
  } catch (err) {
    if (!config.localFallback) {
      console.error('Redis connection failed in production:', err);
      process.exit(1); // Critical failure in production
    }
    console.warn('Redis not installed locally, using in-memory caching');
  }

  // Prometheus metrics endpoint
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });

  // Security middleware
  app.use(helmet());
  app.use(cors({
    origin: 'http://localhost:3000', // Match frontend URL for local testing on port 3000
    credentials: true, // Allow cookies/auth headers for local testing
    methods: ['GET', 'POST', 'OPTIONS'], // Allow necessary methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow necessary headers
  }));
  app.use(morgan('combined'));

  // Rate limiting (adjusted for local vs. production)
  const limiter = rateLimit(config.rateLimit);
  app.use(limiter);

  // Parse JSON bodies
  app.use(express.json());

  // Mount the optimize-resume route
  app.use('/api', optimizeResumeRoute);

  // Health check endpoint
  app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', pid: process.pid, environment: env }));

  // Start Express server
  app.listen(config.port, () => {
    console.log(`Worker ${process.pid} listening on port ${config.port} in ${env} environment`);
  });

  // WebSocket server for real-time monitoring (optional locally)
  if (!config.localFallback) {
    const wss = new Server({ port: config.websocketPort });
    wss.on('connection', (ws) => {
      ws.on('message', (message) => console.log(`Worker ${process.pid} - Received: ${message}`));
      ws.send(JSON.stringify({ pid: process.pid, status: 'connected', environment: env }));
    });
    console.log(`Worker ${process.pid} WebSocket monitoring on port ${config.websocketPort}`);
  } else {
    console.log('WebSocket disabled in local development for simplicity');
  }

  // Prometheus gauge for ATS requests
  const atsRequests = new promClient.Counter({
    name: 'ats_requests_total',
    help: 'Total number of ATS optimization requests',
    labelNames: ['status', 'environment'],
    registers: [register],
  });

  // Increment ATS request counter on each route hit
  app.use((req, res, next) => {
    atsRequests.inc({ status: 'processed', environment: env });
    next();
  });
}

module.exports = app;