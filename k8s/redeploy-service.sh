#!/bin/bash
set -e

echo "🔄 Redeploying backend and frontend..."

# Re-apply backend
echo "⚙️ Updating backend..."
kubectl apply -f k8s/backend.yaml

# Restart backend pods to pick up changes
kubectl rollout restart deployment backend -n 3tier-app

# Re-apply frontend
echo "🖥️ Updating frontend..."
kubectl apply -f k8s/frontend.yaml

# Restart frontend pods to pick up changes
kubectl rollout restart deployment frontend -n 3tier-app

echo "✅ Redeploy complete!"
kubectl get pods -n 3tier-app
