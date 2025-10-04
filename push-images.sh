#!/bin/bash
set -e

DOCKER_USER="your-dockerhub-username"
BACKEND_IMAGE="$DOCKER_USER/3tier-backend:latest"
FRONTEND_IMAGE="$DOCKER_USER/3tier-frontend:latest"

echo "🐳 Logging in to Docker Hub..."
docker login

echo "⚙️ Building backend image..."
docker build -t $BACKEND_IMAGE ./backend

echo "⚙️ Building frontend image..."
docker build -t $FRONTEND_IMAGE ./frontend

echo "📤 Pushing backend image to Docker Hub..."
docker push $BACKEND_IMAGE

echo "📤 Pushing frontend image to Docker Hub..."
docker push $FRONTEND_IMAGE

echo "✅ Images pushed successfully!"
docker images | grep $DOCKER_USER
