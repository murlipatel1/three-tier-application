#!/bin/bash
set -e

echo "Minikube starting"
minikube start

echo "🚀 Starting Kubernetes deployment..."

# 1. Create namespace
echo "📂 Creating namespace..."
kubectl apply -f k8s/namespace.yaml

# 2. Create secrets (for DB credentials, JWT keys, etc.)
echo "🔑 Applying secrets..."
kubectl apply -f k8s/secret.yaml

# 3. Deploy Postgres
echo "🐘 Deploying Postgres..."
kubectl apply -f k8s/postgres.yaml

# 4. Run Prisma migration job
echo "🛠️ Running Prisma migration job..."
kubectl apply -f k8s/prisma-job.yaml

# 5. Deploy backend
echo "⚙️ Deploying backend..."
kubectl apply -f k8s/backend.yaml

# 6. Deploy frontend
echo "🖥️ Deploying frontend..."
kubectl apply -f k8s/frontend.yaml

echo "✅ Kubernetes deployment complete!"
kubectl get pods -n 3tier-app
