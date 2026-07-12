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

The API server's serving certificate lists the host's addresses — loopback, the configured and advertised IPs, and every local interface — as subject alternative names, so clients connecting on any of them get a valid certificate. If those addresses change, for example after the machine moves networks or is reassigned a new IP by DHCP, the old certificate no longer matches. CasOS checks the serving certificate on every start: if it can't be verified against the CA or no longer covers the current set of IPs, only that certificate is reissued to include them. The CA and the rest of the cluster identity are left untouched, so a changed address heals itself on the next restart without invalidating existing kubeconfigs.

The CA itself gets the same self-healing treatment, one level up. On start CasOS validates that the CA certificate and its private key actually belong together — that they parse, that the certificate is a CA, and that its public key matches the key. A CA whose cert and key have drifted apart (from a half-finished copy, a partial restore, or a leftover from an older build) still parses cleanly, yet every certificate signed under it would fail verification. When CasOS detects that mismatch — or an incompatible key type left over from an earlier release — it removes the CA together with everything derived from it (the serving, admin, and kubelet-client certificates, the webhook certs, and the generated component kubeconfigs) so the next step regenerates a fresh, internally consistent chain from scratch instead of trying to patch an unusable one.

## Authorization layers

CasOS uses two authorization layers that work together. The first is standard Kubernetes RBAC (`Node,RBAC`), which every Kubernetes cluster uses. The second is a Casbin-based [authorization webhook](/docs/security/authorization-policies) that runs on port `9443`. When any Casbin authorization rules are present, the API server switches to `Node,RBAC,Webhook` mode and consults the webhook on every request. This gives you policy-as-data control over who can read, write, or delete any resource — on top of RBAC.

Separately, a [Casbin admission webhook](/docs/security/admission-policies) (`ValidatingAdmissionWebhook`) intercepts resource mutations before they are persisted, letting you enforce rules like "no pod may be created in the `default` namespace" or "only admins may delete deployments."

Both webhooks are registered automatically during the bootstrap phase.

## Built-in cluster services

A bare Kubernetes control plane can schedule pods but can't resolve service names or hand out storage on its own — the pieces a fresh cluster normally lacks are exactly the ones an [App Store](/docs/app-store) chart expects to find. So during bootstrap CasOS also reconciles two in-cluster services into the desired state, creating them on first start and healing them if their pod template drifts:

- **Cluster DNS (CoreDNS).** CasOS installs CoreDNS into `kube-system` — its ServiceAccount, RBAC, config, `Service`, and `Deployment` — so pods can resolve each other and external names. It only manages CoreDNS when the `kube-system/kube-dns` service is CasOS-owned; if something else already runs DNS, CasOS steps back and leaves it alone rather than fighting over it.
- **Default storage (local-path provisioner).** For a local, single-machine cluster CasOS installs the local-path provisioner and marks its `local-path` StorageClass as the cluster default, so a [PersistentVolumeClaim](/docs/storage/pvcs) can be satisfied out of the host's disk with no cloud volume plugin. Volumes are provisioned under `<dataDir>/local-path-provisioner`, which is why `dataDir` must be an absolute path for this to run. This step is on by default and can be turned off with `storageProvisionerEnabled` in [configuration](/docs/configuration#built-in-platform-dependencies) on clusters that bring their own storage.

The images for both are configurable, so an air-gapped or proxy-restricted install can point them at a reachable registry mirror. Because the reconcile is idempotent, restarting CasOS never creates duplicates — it converges whatever is there back to the managed definition.

## Authentication via Casdoor

CasOS does not manage user accounts itself. Every login is handled by [Casdoor](https://casdoor.org) over OAuth2/OIDC. The user's browser is redirected to Casdoor, the user authenticates there, and Casdoor sends an authorization code back to CasOS, which exchanges it for a token. This keeps identity management entirely out of CasOS and means you can connect any identity provider that Casdoor supports — Google, GitHub, LDAP, SAML, and more.

## Startup sequence

When CasOS starts it follows a fixed sequence: generate TLS certs if missing → start kine → wait for MySQL → start the API server → poll `/readyz` until healthy → run Bootstrap (RBAC bindings, cluster DNS, default storage, and webhook registration) → start controller-manager and scheduler → start the Beego HTTP server. The web UI only becomes reachable once the entire chain has completed, so if the UI loads, the Kubernetes API is already healthy.
