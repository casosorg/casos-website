---
title: Resource Topology
description: Visualize how workloads, services, and ingresses connect inside a namespace
keywords: [casos, topology, graph, visualization, kubernetes, observability]
---

# Resource Topology

The Resource Topology page draws a live graph of the resources in a namespace and the relationships between them, so you can see how traffic flows through your application at a glance — from an Ingress, down through Services, to the workloads and pods behind them. It answers questions that a flat list can't: which Service does this Ingress route to, which Deployment backs that Service, and which pods are actually running underneath.

Find it under **Observability → Resource Topology**.

## Reading the graph

Each resource is a node, color-coded by kind:

| Kind | Meaning |
|------|---------|
| **Ingress** | External entry point routing HTTP(S) traffic into the cluster. |
| **Service** | Stable virtual endpoint that load-balances across a set of pods. |
| **Deployment** | Controller managing a replicated, stateless workload. |
| **StatefulSet** | Controller managing pods with stable identity and storage. |
| **DaemonSet** | Controller running one pod per node. |
| **Pod** | A running instance of your containers. |

Edges connect resources that are wired together: an Ingress to the Services it routes to, and a controller to the pods it owns (matched by label selector). Controllers are drawn as larger nodes than pods, so the shape of the graph reflects the shape of your application.

Pod nodes are additionally tinted by their current phase, and a legend at the top of the page maps the colors:

- **Running** (green) — the pod is up and healthy.
- **Pending** (orange) — the pod is scheduled but not yet running.
- **Failed** (red) — the pod terminated with an error.
- **Succeeded** (blue) — the pod completed successfully (common for Job pods).

A cluster of red or orange pods under one controller makes a failing rollout obvious without leaving the page.

## Switching namespaces

Use the namespace selector in the top-right corner to change which namespace is graphed. The topology is drawn one namespace at a time; the first namespace loads automatically. If a namespace has no matching resources, the page shows **No resources found** instead of an empty canvas.

## Navigating from the graph

Click any node to jump straight to that resource's management page — clicking a Deployment opens **Workloads → Deployments**, clicking a Service opens **Networking → Services**, and so on. The graph is meant as a starting point: spot something interesting in the topology, then click through to inspect or change it.

:::tip
Hover over a node to highlight it and everything adjacent to it. This is the fastest way to trace which pods sit behind a given Service, or which Services an Ingress fans out to, in a busy namespace.
:::
