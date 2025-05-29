#!/bin/bash

# Change to the project directory
cd /workspace/chatty-face-plugin

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Start the development server
echo "Starting the development server..."
npm run dev