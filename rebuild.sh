#!/bin/bash
set -e

echo "🔄 Stopping running containers..."
docker compose down

echo "🧹 Removing old images..."
docker rmi $(docker images -q backend:latest frontend:latest) 2>/dev/null || true

echo "🚀 Rebuilding images..."
docker compose build --no-cache

echo "📦 Starting containers..."
docker compose up -d --remove-orphans

echo "✅ Rebuild complete!"
docker ps
