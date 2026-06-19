---
title: Pods
description: View and manage Kubernetes Pods in CasOS
keywords: [casos, pods, kubernetes, logs, terminal, files]
---

# Pods

A pod is the smallest thing Kubernetes schedules. It is one or more containers that share a network interface and can share storage volumes. In practice most pods contain a single container, and most pods are created and managed by higher-level controllers like Deployments or StatefulSets rather than directly.

The **Workloads → Pods** page shows every pod in the cluster (across all namespaces, or filtered to one). From here you can see what phase each pod is in, which node it landed on, and what IP it was assigned. More importantly, you can open logs, a terminal, and a file browser for any running pod — without leaving the browser.

## Pod logs

Click **Logs** on any pod row to open the log drawer. For pods with multiple containers, you can select which container to tail. The **tail lines** setting controls how far back CasOS reads (default 200 lines). The output updates once when you open the drawer; refresh it manually if you need newer lines.

For a continuous live view across all replicas of a deployment, use [Log Search](/docs/logs) instead — it aggregates logs from every pod in the deployment and lets you filter by keyword.

## Terminal

Click **Terminal** to open an interactive shell directly in the pod's container via the Kubernetes exec API. This is the equivalent of `kubectl exec -it <pod> -- /bin/sh` but accessible from the browser.

:::info
The terminal requires the pod to be in `Running` phase and the container to have a shell — either `/bin/sh` or `/bin/bash`. Containers built from distroless or scratch images will not have a shell and the terminal will not connect.
:::

## File browser

Click **Files** to browse the container's filesystem. You can navigate directories and read file contents directly from the UI. This is useful for inspecting config files that were mounted as ConfigMaps or Secrets, or for quickly checking a log file that is written to disk rather than stdout.

## Deleting a pod

Deleting a pod removes it immediately. If the pod is owned by a Deployment, StatefulSet, or other controller, a replacement pod is created automatically. If the pod was created directly (no controller), it is gone permanently.
