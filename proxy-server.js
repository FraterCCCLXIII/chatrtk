import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

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
  }
});

// Use the proxy for all requests to /api
app.use('/api', lmStudioProxy);

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running' });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
  console.log(`LM Studio API available at http://localhost:${PORT}/api/v1/...`);
});