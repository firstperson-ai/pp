// backend/routes/optimize-resume.js
const express = require('express');
const router = express.Router();
const { PythonShell } = require('python-shell');
const config = require('../config/config');
const { createClient } = require('redis');
const promClient = require('prom-client');

// Prometheus histogram for request latency
const atsLatency = new promClient.Histogram({
  name: 'ats_request_duration_seconds',
  help: 'Duration of ATS optimization requests in seconds',
  buckets: [0.1, 0.5, 1, 2.5, 5],
  labelNames: ['environment'],
});

let redisClient = null;
try {
  redisClient = createClient({ url: config.redisUrl });
  redisClient.on('error', (err) => {
    if (config.localFallback) {
      console.warn('Redis not available locally, falling back to in-memory caching:', err);
      redisClient = null;
    } else {
      throw err;
    }
  });
  redisClient.connect().catch(console.error);
} catch (err) {
  if (!config.localFallback) {
    console.error('Redis connection failed in production:', err);
    process.exit(1);
  }
  console.warn('Redis not installed locally, using in-memory caching');
}

router.post('/api/optimize-resume', async (req, res) => {  // Updated endpoint to match frontend
  const end = atsLatency.startTimer({ environment: config.localFallback ? 'development' : 'production' });
  console.log(`Worker ${process.pid} - optimize-resume POST called in ${process.env.NODE_ENV} environment`);
  try {
    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {
      console.log(`Worker ${process.pid} - Missing resume or job description`);
      return res.status(400).json({ error: 'Resume and job description are required' });
    }

    // Check cache (Redis or in-memory)
    let cachedResult = null;
    const cacheKey = `ats:${Buffer.from(JSON.stringify({ resume, jobDescription })).toString('base64')}`;
    if (redisClient) {
      cachedResult = await redisClient.get(cacheKey);
    } else {
      // In-memory caching fallback
      const inMemoryCache = new Map();
      cachedResult = inMemoryCache.get(cacheKey);
    }

    if (cachedResult) {
      console.log(`Worker ${process.pid} - Cache hit for ${cacheKey}`);
      end({ status: 'cached' });
      return res.status(200).json(JSON.parse(cachedResult));
    }

    // Configure Python script options
    const options = {
      scriptPath: config.pythonScriptPath,
      args: [resume, jobDescription],
    };

    // Run Python script
    const result = await new Promise((resolve, reject) => {
      const shell = new PythonShell('atsOptimizer.py', options);
      let output = '';
      shell.on('message', (message) => (output += message));
      shell.on('error', reject);
      shell.on('close', () => resolve(output));
      shell.end((err) => err && reject(err));
    });

    const parsedResult = JSON.parse(result);
    console.log(`Worker ${process.pid} - Python response:`, parsedResult);

    // Cache result
    if (redisClient) {
      await redisClient.setEx(cacheKey, config.cacheTTL, JSON.stringify(parsedResult));
    } else {
      const inMemoryCache = new Map();
      inMemoryCache.set(cacheKey, JSON.stringify(parsedResult));
    }

    // Emit performance metric via WebSocket (optional locally)
    if (!config.localFallback && typeof wss !== 'undefined' && wss.clients.size > 0) {
      wss.clients.forEach((client) => {
        client.send(JSON.stringify({
          pid: process.pid,
          atsScore: parsedResult.atsScore,
          timestamp: new Date().toISOString(),
          latency: end({ status: 'processed' }).toFixed(3),
          environment: process.env.NODE_ENV,
        }));
      });
    }

    res.status(200).json({
      atsScore: parsedResult.atsScore,
      suggestions: parsedResult.suggestions,
    }); // Return only score and suggestions for original workflow
  } catch (error) {
    console.error(`Worker ${process.pid} - API error:`, error);
    end({ status: 'error' });
    res.status(500).json({ error: 'Optimization failed. Please try again.' });
  }
});

let wss; // Global WebSocket server instance (initialized in server.js)
module.exports = router;