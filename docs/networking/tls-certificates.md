---
title: TLS Certificates
description: Serve Ingress hosts over HTTPS in CasOS with Let's Encrypt or your own certificate
keywords: [casos, tls, https, certificate, lets encrypt, acme, ingress, kubernetes]
---

# TLS Certificates

CasOS can serve an [Ingress](/docs/networking/ingress) host over HTTPS. It gives you two ways to attach a certificate to an Ingress:

- **Let's Encrypt** — CasOS obtains a free, publicly trusted certificate automatically.
- **Upload a certificate** — you provide a certificate and private key you already have.

Either way, CasOS stores the result as a standard Kubernetes TLS Secret named `<ingress-name>-tls` and wires it into the Ingress's `spec.tls`, so the Ingress controller starts terminating HTTPS for the host. Nothing outside CasOS needs to be installed for this — in particular, CasOS does **not** rely on [cert-manager](https://cert-manager.io/); it runs its own built-in ACME client.

## Where to find it

TLS is managed per Ingress from **Networking → Ingress**. Each host row shows a **TLS badge** that reflects its current certificate state:

| Badge | Meaning |
|-------|---------|
| `HTTP` | No TLS configured; the host is served over plain HTTP. |
| `HTTPS (no cert)` | TLS is expected but no certificate secret exists yet. |
| `HTTPS (issuing…)` | A Let's Encrypt request is in progress (`pending` / `verifying`). |
| `HTTPS (failed)` | Issuance failed — hover the badge to see the error. |
| `HTTPS · <date>` | A certificate is installed; the date is its expiry (hover to see "Valid until …"). |

Open the certificate dialog for an Ingress to choose between the **Let's Encrypt (auto)** and **Upload Certificate** tabs.

## Option 1 — Let's Encrypt (automatic)

CasOS runs the full ACME **HTTP-01** flow against Let's Encrypt and installs the issued certificate for you. You provide:

| Field | Description |
|-------|-------------|
| **Domain** | The hostname the certificate is for (e.g. `myapp.example.com`). Must match the Ingress host. |
| **CasOS Service Name** | The Kubernetes Service that exposes the CasOS server. Defaults to `casos`. |
| **CasOS Service Port** | The port of that Service. Defaults to `9000`. |

### Prerequisites

HTTP-01 works by having Let's Encrypt fetch a token over plain HTTP, so all of the following must be true **before** you request a certificate:

1. **An Ingress controller is installed** in the cluster (see [Ingress → Prerequisites](/docs/networking/ingress)). CasOS creates Ingress records, but the controller is what actually serves the challenge.
2. **The domain resolves publicly to your cluster** — its DNS `A`/`AAAA` record points at the Ingress controller's external IP.
3. **Port 80 is reachable from the internet** for that domain. The HTTP-01 challenge is served over HTTP, not HTTPS.

### How it works

When you submit the Let's Encrypt tab, CasOS:

1. Creates (or reuses) an ACME account, stored as a Secret named `casos-acme-account` in the Ingress's namespace.
2. Asks Let's Encrypt to authorize the domain and hands back the HTTP-01 challenge token.
3. Temporarily creates a helper Ingress (`<ingress-name>-acme-tmp`) that routes `/.well-known/acme-challenge/` to the CasOS Service — this is why the **Service Name / Port** must be correct. CasOS itself answers the challenge request.
4. Waits for Let's Encrypt to validate the domain, finalizes the order, and stores the issued certificate (an ECDSA key) as the `<ingress-name>-tls` Secret.
5. Removes the temporary challenge Ingress.

The request runs in the background; the badge moves from `issuing…` to `HTTPS · <expiry>` on success, or to `failed` (with the error in the tooltip) if anything goes wrong. The whole flow times out after five minutes.

### Renewal — important

**CasOS does not renew Let's Encrypt certificates automatically.** Let's Encrypt certificates are valid for about **90 days**. Before a certificate expires you must open the Ingress and request Let's Encrypt again; that re-runs the flow and replaces the secret with a fresh certificate. Watch the expiry date shown on the TLS badge and re-issue in good time (renewing a couple of weeks early is a safe habit).

### Rate limits

CasOS talks to Let's Encrypt's **production** service directly (there is no staging toggle). Let's Encrypt enforces [rate limits](https://letsencrypt.org/docs/rate-limits/) — most importantly a cap on certificates per domain per week. Don't retry a failing request in a tight loop; fix the underlying cause (DNS, port 80, or the Service name/port) first, then try again.

## Option 2 — Upload your own certificate

Use this tab when you already have a certificate — for example one issued by your company's CA, a wildcard certificate, or a certificate bought from a commercial provider. Paste two PEM blocks:

| Field | Description |
|-------|-------------|
| **Certificate (PEM)** | The certificate, beginning with `-----BEGIN CERTIFICATE-----`. Include the full chain (leaf first, then any intermediates) if your CA provides one. |
| **Private Key (PEM)** | The matching private key, e.g. `-----BEGIN EC PRIVATE KEY-----` or `-----BEGIN PRIVATE KEY-----`. |

CasOS stores them as the `<ingress-name>-tls` Secret and attaches TLS to the Ingress immediately — there are no external prerequisites and no ACME challenge. The TLS badge shows the certificate's expiry, read from the certificate itself. Uploaded certificates are also **not** renewed for you: when the certificate nears expiry, upload a new one the same way.

## Troubleshooting

- **Badge stays on `HTTPS (failed)`** — hover it for the error message. The most common causes are the domain not resolving to the cluster, port 80 being blocked, or no Ingress controller running.
- **`HTTPS (issuing…)` never finishes** — the flow times out after five minutes. Confirm Let's Encrypt can reach `http://<domain>/.well-known/acme-challenge/...` from the public internet, then request again.
- **Wrong CasOS Service Name / Port** — the temporary challenge Ingress routes back to CasOS through this Service. If it's wrong, Let's Encrypt gets a 404 for the challenge and validation fails. The defaults are `casos` / `9000`.
- **Certificate expired unexpectedly** — remember there is no auto-renewal; re-issue (Let's Encrypt) or re-upload (your own certificate) before the expiry date on the badge.

## Removing HTTPS

Deleting the `<ingress-name>-tls` Secret, or [deleting the Ingress](/docs/networking/ingress#deleting-an-ingress) itself, stops HTTPS termination for the host. Deleting the Ingress leaves the backend services running and reachable by other means (ClusterIP, NodePort); it just removes the HTTPS entry point.
