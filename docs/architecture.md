---
title: Architecture
description: CasOS architecture — how the embedded Kubernetes control plane works
keywords: [casos, architecture, kubernetes, kine, embedded]
---

# Architecture

CasOS is a self-contained cloud operating system. Unlike typical Kubernetes tooling that assumes a cluster already exists, CasOS *is* the cluster. Run a single binary and you get a fully functional Kubernetes control plane with a web UI — no `kubeadm`, no external etcd, no separate API server process to manage.

## A single binary

Everything runs inside one Go process: the Beego HTTP server that serves the web UI and REST API, the Kubernetes API server, the controller manager, and the scheduler. They communicate through in-process function calls and shared channels rather than over the network, which keeps startup time fast and the operational footprint small.

## MySQL instead of etcd

Standard Kubernetes stores all state in etcd. CasOS replaces etcd with [kine](https://github.com/k3s-io/kine), a lightweight shim that translates etcd's watch/range protocol into SQL queries. kine starts on `127.0.0.1:2379` and talks to the same MySQL database that CasOS uses for application data. This means there is no etcd cluster to operate, and your Kubernetes state is backed up automatically whenever you back up MySQL.

```
CasOS process
├── Beego HTTP (:9000)         — web UI + REST API
├── kube-apiserver (:6443)     — Kubernetes API (in-process)
├── controller-manager         — reconciliation loops (in-process)
├── scheduler                  — pod placement (in-process)
└── kine (:2379)               — etcd shim → MySQL
```

## TLS bootstrap

On first start, CasOS generates a self-signed CA and issues all the certificates Kubernetes needs: the API server cert, the kubelet client cert, and a service-account key pair. All of these are written to `<dataDir>/tls/` and reused on subsequent restarts, so the cluster identity stays stable across reboots.

## Authorization layers

CasOS uses two authorization layers that work together. The first is standard Kubernetes RBAC (`Node,RBAC`), which every Kubernetes cluster uses. The second is a Casbin-based [authorization webhook](/docs/security/authorization-policies) that runs on port `9443`. When any Casbin authorization rules are present, the API server switches to `Node,RBAC,Webhook` mode and consults the webhook on every request. This gives you policy-as-data control over who can read, write, or delete any resource — on top of RBAC.

Separately, a [Casbin admission webhook](/docs/security/admission-policies) (`ValidatingAdmissionWebhook`) intercepts resource mutations before they are persisted, letting you enforce rules like "no pod may be created in the `default` namespace" or "only admins may delete deployments."

Both webhooks are registered automatically during the bootstrap phase.

## Authentication via Casdoor

CasOS does not manage user accounts itself. Every login is handled by [Casdoor](https://casdoor.org) over OAuth2/OIDC. The user's browser is redirected to Casdoor, the user authenticates there, and Casdoor sends an authorization code back to CasOS, which exchanges it for a token. This keeps identity management entirely out of CasOS and means you can connect any identity provider that Casdoor supports — Google, GitHub, LDAP, SAML, and more.

## Startup sequence

When CasOS starts it follows a fixed sequence: generate TLS certs if missing → start kine → wait for MySQL → start the API server → poll `/readyz` until healthy → run Bootstrap (RBAC bindings + webhook registration) → start controller-manager and scheduler → start the Beego HTTP server. The web UI only becomes reachable once the entire chain has completed, so if the UI loads, the Kubernetes API is already healthy.
