
# 3-Tier Todo App

This repository contains a **3-tier Todo application** with **frontend**, **backend**, and **Postgres database**, fully containerized with Docker and deployable on Kubernetes (Minikube). This README guides a new user through setup, Docker usage, Kubernetes deployment, and provided helper scripts.

---

## Table of Contents
1. [Application Overview](#application-overview)
2. [Docker Setup](#docker-setup)
3. [Kubernetes Setup](#kubernetes-setup)
4. [Helper Scripts](#helper-scripts)
5. [Accessing the Application](#accessing-the-application)

---

## Application Overview

The 3-tier architecture:

1. **Frontend**
   - Built with **Next.js**
   - Runs on port `3000` inside the container
   - Connects to the backend via `NEXT_PUBLIC_API_URL`

2. **Backend**
   - Node.js + Express + Prisma ORM
   - Runs on port `4000` inside the container
   - Connects to Postgres using `DATABASE_URL` from ConfigMap and Secrets

3. **Database (Postgres)**
   - Stores todos and user data
   - Credentials stored in Kubernetes **Secrets**
   - Persistent storage via **PersistentVolumeClaim (PVC)**

---

## Docker Setup

### Build and Run with Docker Compose

1. **First-time build**
```bash
./first-run.sh
````

* Builds frontend and backend images
* Starts all services (frontend, backend, postgres) using `docker-compose.yml`

2. **Rebuild after code changes**

```bash
./rebuild.sh
```

* Stops running containers
* Rebuilds backend and frontend images
* Restarts containers

3. **Push images to Docker Hub**

```bash
./push-images.sh
```

* Builds backend and frontend Docker images
* Tags images with your Docker Hub username
* Pushes images to Docker Hub

### Folder Structure

```
project-root/
├── backend/
├── frontend/
├── docker-compose.yml
├── first-run.sh
├── rebuild.sh
├── push-images.sh
└── k8s/
```

---

## Kubernetes Setup (Minikube)

### Prerequisites

* [Minikube](https://minikube.sigs.k8s.io/docs/start/) installed
* `kubectl` installed and configured

### Key Components

* **Namespace**: `3tier-app`
* **Secrets**: `postgres-secret` (DB credentials)
* **ConfigMap**: `namespace` (DATABASE_URL, BACKEND_URL, FRONTEND_URL , Note: currently included in namespace you can mantain other YAML file for it)
* **Deployments**: frontend, backend, postgres
* **Services**: frontend (NodePort), backend (ClusterIP), postgres (ClusterIP)
* **PVC**: Postgres persistent storage
* **Optional Prisma Job**: runs migrations before backend starts

### Deployment Order

1. Create namespace:

```bash
kubectl apply -f k8s/namespace.yaml
```

2. Apply secrets:

```bash
kubectl apply -f k8s/secret.yaml
```

3. Deploy Postgres:

```bash
kubectl apply -f k8s/postgres.yaml
```

4. Run Prisma migration (if using Prisma):

```bash
kubectl apply -f k8s/prisma-job.yaml
```

5. Deploy Backend:

```bash
kubectl apply -f k8s/backend.yaml
```

6. Deploy Frontend:

```bash
kubectl apply -f k8s/frontend.yaml
```

### Access Frontend

```bash
minikube service frontend -n 3tier-app
```

### Access Deployment Pods and your K8s

```bash
minikube dashboard
```


---

## Helper Scripts

| Script                 | Purpose                                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `first-run.sh`         | Build and start all Docker containers for the first time                                                          |
| `rebuild.sh`           | Rebuild backend and frontend Docker images and restart containers                                                 |
| `push-images.sh`       | Build Docker images and push to Docker Hub                                                                        |
| `deploy-k8s.sh`        | Apply all Kubernetes manifests in order (namespace → secret → configmap → postgres → prisma → backend → frontend) |
| `redeploy-services.sh` | Redeploy only frontend and backend services in Kubernetes                                                         |

### Example: Deploy all to Minikube

```bash
./deploy-k8s.sh
```

### Example: Redeploy only frontend and backend

```bash
./redeploy-services.sh
```

---

## Notes for New Users

* **Environment Variables**

  * Frontend calls backend at `http://backend:4000/` inside K8s
  * Backend connects to Postgres using the `DATABASE_URL` from ConfigMap + Secret

* **Database Persistence**

  * Postgres data is stored in a PersistentVolumeClaim (`postgres-pvc`)
  * Data remains intact even if pods are restarted

* **Minikube NodePort**

  * Frontend is exposed via NodePort for browser access
  * Use `minikube service frontend -n 3tier-app` to open it automatically

---

## Summary

This project demonstrates a full **3-tier architecture**:

* **Frontend** (Next.js)
* **Backend** (Node.js + Express + Prisma)
* **Database** (Postgres)

With **Docker Compose**, you can run it locally.
With **Kubernetes (Minikube)**, you can deploy a scalable, containerized version of the app with proper secrets, config, and persistence.

All necessary helper scripts are included to make development, deployment, and redeployment seamless.

```