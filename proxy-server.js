import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Enable CORS with more specific options
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle OPTIONS requests directly to avoid LM Studio validation
app.options('*', (req, res) => {
  res.status(204).end();
});

// Create a proxy for LM Studio
const lmStudioProxy = createProxyMiddleware({
  target: 'http://localhost:1234',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding
  },
  // Handle errors
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  },
  // Log requests
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.url} to LM Studio`);
    
    // For chat completions, ensure messages field exists for POST requests
    if (req.method === 'POST' && req.url.includes('/v1/chat/completions') && !req.body?.messages) {
      console.log('Adding empty messages array to request');
      proxyReq.setHeader('Content-Type', 'application/json');
      const bodyData = JSON.stringify({ messages: [] });
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  }
});

// Use the proxy for all requests to /api
app.use('/api', lmStudioProxy);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Handle root endpoint
app.all('/', (req, res) => {
  if (req.method === 'OPTIONS') {
    // Handle OPTIONS preflight request
    res.status(204).end();
  } else {
    // Respond to other requests
    res.json({ 
      status: 'ok', 
      message: 'LM Studio proxy server is running',
      endpoints: [
        '/api/v1/chat/completions',
        '/api/v1/completions',
        '/api/v1/models'
      ]
    });
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`LM Studio API available at http://localhost:${PORT}/api/v1/...`);
});