#!/bin/bash
# Start the proxy server in the background
node proxy-server.js &
PROXY_PID=$!

# Start the development server
npm run dev

# When the development server exits, kill the proxy server
kill $PROXY_PID