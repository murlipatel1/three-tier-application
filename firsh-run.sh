#!/bin/bash
set -e

echo "🚀 Building images for the first time..."
docker compose build

echo "📦 Starting containers..."
docker compose up -d --remove-orphans

echo "✅ First-time setup complete!"
docker ps
