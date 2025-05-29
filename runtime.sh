#!/bin/bash

# Change to the project directory
cd /workspace/chatty-face-plugin

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Set environment variables for the OpenHands runtime
export PORT=12001
export HOST=0.0.0.0
export VITE_BASE_URL="https://work-2-wlyiroanwmhpkloe.prod-runtime.all-hands.dev"

# Start the development server
echo "Starting the development server on port $PORT..."
npm run dev -- --host $HOST --port $PORT