# Urumi Store Platform

Multi-tenant WooCommerce provisioning platform built with:

- Node.js backend
- Kubernetes
- Helm
- Ingress
- MySQL StatefulSets
- Audit logging
- Provisioning queue
- Resource quotas & limits
- Environment-based production config

---

## Architecture

- Namespace per store
- Helm upgrade/install idempotency
- Ingress routing per store
- Audit log tracking
- Controlled scaling (queue-based provisioning)

---

## Run Locally

```bash
ENVIRONMENT=local node src/index.js

# Urumi Store Platform

Multi-tenant WooCommerce provisioning platform built with:

- Node.js backend
- Kubernetes
- Helm
- Ingress
- MySQL StatefulSets
- Audit logging
- Provisioning queue
- Resource quotas & limits
- Environment-based production config

---

## Architecture

- Namespace per store
- Helm upgrade/install idempotency
- Ingress routing per store
- Audit log tracking
- Controlled scaling (queue-based provisioning)

---

## Run Locally

```bash
ENVIRONMENT=local node src/index.js
