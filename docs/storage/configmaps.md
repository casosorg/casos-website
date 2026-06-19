---
title: ConfigMaps
description: Manage Kubernetes ConfigMaps in CasOS
keywords: [casos, configmap, kubernetes, storage, configuration]
---

# ConfigMaps

A ConfigMap stores configuration data as plain key-value pairs and makes it available to pods without baking the config into the container image. This lets you change configuration without rebuilding or redeploying the image.

A single ConfigMap can hold many keys. Values can be anything — a short string, a JSON blob, or a multi-line file. When you mount a ConfigMap as a volume, each key becomes a file in the mounted directory. When you inject keys as environment variables, each key becomes an env var inside the container.

:::caution
ConfigMaps are not encrypted. Do not store passwords, tokens, or private keys in a ConfigMap — use a [Secret](/docs/storage/secrets) instead.
:::

## Creating a ConfigMap

Open **Storage → ConfigMaps** and click **Add ConfigMap**. Give it a namespace and a name, then add as many key-value pairs as you need. Values can span multiple lines, which is useful for config files.

## Using a ConfigMap in a deployment

In **Workloads → Deployments**, open the volume configuration for a deployment and add a ConfigMap volume. Specify the ConfigMap name and the path where it should be mounted inside the container. Every key in the ConfigMap will appear as a file at that path.

Alternatively, you can inject individual keys as environment variables by referencing them in the deployment's env var configuration with a `configMapKeyRef`.

## Updating a ConfigMap

Click the edit icon to change values. Running pods that mount the ConfigMap as a volume will see the new values after the kubelet's sync period (typically 1–2 minutes) — no pod restart needed. Pods that consumed ConfigMap values as environment variables at startup time will not see the change until they are restarted, because env vars are read once at container start.

## Deleting a ConfigMap

Deleting a ConfigMap that is currently mounted by a pod does not immediately crash that pod — Kubernetes keeps the mounted files in place. But if that pod is restarted or rescheduled, it will fail to start because the ConfigMap it references no longer exists.
