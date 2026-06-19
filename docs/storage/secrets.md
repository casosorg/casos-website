---
title: Secrets
description: Manage Kubernetes Secrets in CasOS
keywords: [casos, secrets, kubernetes, storage, credentials]
---

# Secrets

A Secret works like a ConfigMap but is intended for sensitive data: passwords, API tokens, TLS certificates, Docker registry credentials. Kubernetes stores Secret values base64-encoded and can restrict access to them through RBAC — only pods and users that have explicit permission can read a Secret's contents.

:::caution
Base64 encoding is not encryption. Any user with `get` permission on a Secret object can read it. For production deployments, consider enabling [Kubernetes encryption at rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/) for the Secret resource type, which encrypts Secret values before writing them to the database (MySQL/kine in CasOS).
:::

## Creating a Secret

Open **Storage → Secrets** and click **Add Secret**. Choose the namespace, a name, and the type. For most use cases the type is `Opaque`, which is a generic key-value store. Other types — `kubernetes.io/tls`, `kubernetes.io/dockerconfigjson`, `kubernetes.io/service-account-token` — have a specific structure expected by Kubernetes controllers.

Enter your key-value pairs. CasOS base64-encodes the values automatically before storing them.

## Using a Secret in a deployment

Secrets can be consumed the same two ways as ConfigMaps: mounted as a volume directory (each key becomes a file) or injected as environment variables using `secretKeyRef`. The volume approach is preferred for TLS certificates and Docker config — Kubernetes writes the files with restricted permissions and updates them automatically if the Secret changes.

## Docker registry credentials

If your container images are hosted in a private registry, create a Secret of type `kubernetes.io/dockerconfigjson` with the registry credentials, then reference it as an `imagePullSecret` in your Deployment. CasOS passes this to the container runtime so it can authenticate the image pull.

## Deleting a Secret

Like ConfigMaps, deleting a Secret does not immediately crash running pods that mount it. But any pod that restarts and references the deleted Secret will fail to start. Remove or update the reference in the Deployment before deleting the Secret to avoid disruption.
