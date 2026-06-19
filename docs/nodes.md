---
title: Nodes
description: View and manage cluster nodes in CasOS
keywords: [casos, nodes, kubernetes, cluster]
---

# Nodes

A node is a machine — physical or virtual — that runs workloads. Nodes provide the CPU, memory, and storage that pods actually execute on. CasOS displays the status and capacity of every node in the cluster from the **Nodes** page.

## Node health

The most important thing to know about a node is whether it is `Ready`. A node is `Ready` when the kubelet is running and can accept pods. `NotReady` means the node has reported a problem — often disk pressure, memory pressure, or a network issue. `Unknown` means the node controller has not heard from the node in a while (the default grace period is 40 seconds), which usually indicates the node is unreachable.

When a node stays `NotReady` or `Unknown`, the pod eviction timer starts. After a configurable grace period (default 5 minutes), Kubernetes moves the pods on that node to other nodes.

## Node capacity and resource usage

The node list shows each node's allocatable CPU and memory — the amount available for pods after Kubernetes reserves capacity for system components. When metrics-server is installed, it also shows current CPU and memory utilization, which is the same data the [Dashboard](/docs/dashboard) aggregates cluster-wide.

## Adding worker nodes

CasOS runs the embedded control plane — the API server, scheduler, and controller manager. To actually schedule workloads you need at least one node with a kubelet. Install `kubelet` and `containerd` on the worker machine, then join it to the CasOS API server at `https://<casos-host>:<apiserverPort>` using a bootstrap token or a kubeconfig. See the [upstream kubelet documentation](https://kubernetes.io/docs/concepts/architecture/nodes/) for the join procedure.

In a single-machine setup, the machine running CasOS itself can also run a kubelet and act as a worker node.
