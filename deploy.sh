#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Installing dependencies..."
npm install

echo "Building TypeScript..."
npm run build

echo "Starting with PM2..."
if ! command -v pm2 >/dev/null 2>&1; then
  echo "PM2 not found. Installing globally..."
  npm install -g pm2
fi
pm2 startOrRestart ecosystem.config.js --env production
pm2 save

echo "Deployment complete. Use 'pm2 status' to verify."
