---
title: Dashboard
description: CasOS cluster dashboard — stats, resource usage, and health at a glance
keywords: [casos, dashboard, cluster, metrics]
---

# Dashboard

The Dashboard is the first thing you see after logging in. It pulls live data from the embedded Kubernetes API server and gives you an at-a-glance picture of how the cluster is doing — without opening a terminal.

## Cluster counters

Across the top of the Dashboard, CasOS shows running totals for nodes, pods, deployments, namespaces, services, ConfigMaps, and ServiceAccounts. The node and deployment counters break down into two numbers: total and healthy. For nodes that means `Ready` vs total; for deployments it means how many have reached their desired replica count vs how many exist. If those two numbers diverge, something needs attention.

## Resource usage

When [metrics-server](https://github.com/kubernetes-sigs/metrics-server) is installed in the cluster, the Dashboard shows live CPU and memory utilization aggregated across every node. CPU is expressed in millicores (so 1000m = 1 core), and memory in MiB. Without metrics-server these charts show zero and no error is raised — they simply stay blank until a metrics source is available.

## Node breakdown

Two small charts show how your nodes are distributed by operating system (typically all `linux`) and CPU architecture (`amd64`, `arm64`, etc.). These are useful when running a mixed-architecture cluster and you want to confirm a new node joined with the right arch.

## Pod phase distribution

The pod chart breaks pods into their current Kubernetes phase: `Running`, `Pending`, `Succeeded`, `Failed`, and `Unknown`. In a healthy cluster almost everything should be `Running`. A large `Pending` slice usually means the scheduler cannot place pods — check node resources or taints. `Unknown` means the node hosting those pods has become unreachable.

## Unhealthy pods

Below the charts, CasOS lists every pod that is degraded right now. It catches the common failure reasons — `CrashLoopBackOff`, `OOMKilled`, `ImagePullBackOff`, `ErrImagePull`, `InvalidImageName`, `CreateContainerConfigError`, `CreateContainerError`, and `Evicted` — by inspecting each container's waiting and terminated state. For every unhealthy pod you can see its namespace, name, phase, and the specific reason, so you know exactly which deployment to look at first.
