---
title: Namespaces
description: Manage Kubernetes Namespaces in CasOS
keywords: [casos, namespaces, kubernetes, access control, isolation]
---

# Namespaces

A namespace is a virtual cluster inside the physical cluster. Resources in different namespaces are isolated from each other by name — you can have a `web` Deployment in the `staging` namespace and a `web` Deployment in the `production` namespace without any conflict. RBAC permissions and ResourceQuotas are scoped to a namespace, which makes them the primary tool for organizing multi-team or multi-environment clusters.

Kubernetes creates four namespaces automatically. `default` is where resources go when no namespace is specified. `kube-system` holds the cluster components themselves (controller manager, scheduler, etc.). `kube-public` contains data that should be readable by all users, including unauthenticated ones. `kube-node-lease` holds the node heartbeat objects used by the node lifecycle controller.

:::caution
Do not delete the system namespaces (`kube-system`, `kube-public`, `kube-node-lease`, `default`). Deleting them will break the cluster.
:::

## Creating a namespace

Open **Access Control → Namespaces** and click **Add Namespace**. Namespace names must be lowercase, alphanumeric, and may contain hyphens. Once created, the namespace appears in every namespace dropdown across the CasOS UI.

## Deleting a namespace

Deleting a namespace deletes everything inside it — all pods, deployments, services, configmaps, secrets, PVCs, and everything else in that namespace. This cannot be undone. The namespace will show as `Terminating` while Kubernetes cleans up its resources, which can take a minute or two.

## Limiting resource consumption per namespace

Use [Resource Quotas](/docs/access-control/resource-quotas) to cap how much CPU, memory, and object count a namespace can consume. This prevents one team's workloads from starving another's.
