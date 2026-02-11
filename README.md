🚀 Urumi Store Platform

Multi-tenant WooCommerce provisioning platform built with:

Node.js backend

Kubernetes (kind locally, k3s in production)

Helm-based provisioning

NGINX Ingress

MySQL StatefulSets

Audit logging

Provisioning queue (controlled scaling)

Resource quotas & limits

Environment-driven configuration (local vs prod)

📦 Deliverables (In This Repository)

This repository includes:

✅ Backend API (store lifecycle + provisioning logic)

✅ Dashboard (store creation & management UI)

✅ Provisioning & orchestration logic

✅ Helm chart(s)

✅ values-local.yaml and values-prod.yaml

✅ Resource quotas & LimitRange templates

✅ Audit logging system

✅ Provisioning queue (controlled concurrency)

✅ System design & tradeoffs documentation

🏗 Architecture Overview
Per-Store Isolation Model

Each store:

Runs in its own Kubernetes namespace

Has its own MySQL StatefulSet

Has its own WordPress Deployment

Has its own Ingress rule

Is installed using Helm (upgrade --install)

Is tracked via audit logs

Provisioning flow:

API receives POST /stores

Store record created (status = Queued)

Provisioning job added to queue

Helm upgrade --install

Rollout wait

Status updated → Ready

Audit log recorded

🧪 Local Setup Instructions (Kind + Docker Desktop)
1️⃣ Prerequisites

Docker Desktop (min 4–6GB memory)

kubectl

Helm

Node.js

kind

2️⃣ Create Local Kubernetes Cluster
kind create cluster --name urumi


Install NGINX ingress (if not already):

kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/kind/deploy.yaml


Wait until ingress controller is ready.

3️⃣ Backend Setup
cd backend
npm install


Set environment:

PowerShell:

$env:ENVIRONMENT="local"


Mac/Linux:

export ENVIRONMENT=local


Run:

node src/index.js


API runs on:

http://localhost:3000

4️⃣ Create a Store
POST http://localhost:3000/stores


Response:

{
  "id": "store-xxxxxx",
  "status": "Queued"
}


Once Ready, access:

http://store-xxxxxx.localhost

5️⃣ Place an Order

Open store URL

Complete WordPress setup

Install WooCommerce plugin

Add product

Place test order

🌍 VPS / Production-like Setup (k3s)
1️⃣ Install k3s on VPS
curl -sfL https://get.k3s.io | sh -


Verify:

kubectl get nodes

2️⃣ Install NGINX Ingress
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

3️⃣ DNS Setup

Configure wildcard DNS:

*.yourdomain.com → VPS IP


Example:

store-abc123.yourdomain.com

4️⃣ Run Backend in Production Mode
ENVIRONMENT=prod node src/index.js


This automatically uses:

values-prod.yaml


No code change required.

🛠 Helm Charts

Located at:

/charts/store


Includes:

Deployment (WordPress)

StatefulSet (MySQL)

Service

Ingress

ResourceQuota

LimitRange

Secrets

Local:
values-local.yaml

Production:
values-prod.yaml


Differences include:

Higher resource requests/limits

TLS enabled

Production domain

Increased replica count

📊 API Endpoints
Create Store
POST /stores

List Stores
GET /stores

Get Store
GET /stores/:id

Delete Store
DELETE /stores/:id

Audit Logs
GET /stores/audit/logs

⚙ Scaling & Reliability Features
1️⃣ Provisioning Queue

Only 2 stores provision at a time

Prevents cluster overload

Production-safe concurrency control

2️⃣ Idempotent Helm

Uses:

helm upgrade --install


Handles:

Fresh install

Upgrade

Reinstall after failure

3️⃣ Failed Release Cleanup

Before provisioning:

Checks Helm status

Cleans up failed releases

Re-attempts install

4️⃣ Resource Governance

Each namespace includes:

ResourceQuota

LimitRange

CPU & memory restrictions

Prevents noisy neighbor issues.

🔐 Audit Logging

Tracks:

Store creation requests

Provisioning failures

Rollout failures

Ready state

Deletion attempts

Deletion success/failure

Stored via SQLite (local DB).

🧠 System Design & Tradeoffs
Architecture Choice

Chose:

Namespace-per-tenant isolation

Helm-based declarative provisioning

Upgrade/install idempotent pattern

Queue-based concurrency control

This balances:

Isolation

Simplicity

Scalability

Operational safety

Idempotency & Failure Handling

Handled by:

helm upgrade --install

Pre-check for failed releases

Cleanup before reinstall

Rollout status verification

Audit trail for traceability

Controlled retry via queue

What Changes for Production
Area	Local	Production
Cluster	kind	k3s
DNS	.localhost	wildcard DNS
TLS	Disabled	Enabled
Storage	local-path	Production StorageClass
Secrets	Local static	External secret manager
Replicas	1	2+
Resource Limits	Minimal	Production tuned
Concurrency	2	Configurable
🚀 Production Hardening Roadmap

Future improvements:

HPA (Horizontal Pod Autoscaler)

Centralized logging

Prometheus metrics

External secret manager

CI/CD pipeline

Rolling upgrades

Multi-node cluster support

📌 Status

✔ Multi-tenant provisioning system
✔ Namespace isolation
✔ Helm idempotency
✔ Audit logging
✔ Resource governance
✔ Controlled scaling
✔ Local & production configuration

Production-ready foundation.

👤 Author

Shafiq Ahmed
