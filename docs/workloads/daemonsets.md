---
title: DaemonSets
description: Manage Kubernetes DaemonSets in CasOS
keywords: [casos, daemonsets, daemon set, kubernetes, workloads]
---

# DaemonSets

A DaemonSet makes sure that a copy of a pod runs on every node in the cluster (or on every node that matches a selector). When you add a node, the DaemonSet controller automatically schedules its pod there; when you remove a node, the pod is cleaned up with it. This is the right choice for node-level agents that must run everywhere — log collectors, metrics exporters, storage daemons, and CNI or CSI plugins.

## Viewing DaemonSets

Open **Workloads → Daemon Sets**. The list spans every namespace and shows each DaemonSet's namespace, name, container image, and creation time. The **Desired / Ready** column tracks rollout health: the first number is how many nodes should run the pod, the second is how many currently have a ready pod. When the two match, the tag turns green; while pods are still starting it stays orange. Click **Refresh** to pull the latest state from the API server.

## Creating a DaemonSet

Click **Add** and fill in the drawer:

- **Namespace** — the namespace to create the DaemonSet in.
- **Name** — a unique name within the namespace.
- **Image** — the container image to run on every node, e.g. `fluent/fluent-bit:latest`.
- **Container Name** — optional; leave it empty to reuse the DaemonSet name as the container name.

You can also define **environment variables** for the container. Each variable can be a plain literal value, or it can pull its value from a key in a [ConfigMap](/docs/storage/configmaps) or a [Secret](/docs/storage/secrets) in the same namespace. Selecting a namespace loads the ConfigMaps and Secrets available there so you can pick them from a dropdown.

Click **Create** to submit. CasOS creates the DaemonSet and Kubernetes rolls a pod out to each eligible node.

## Editing a DaemonSet

Click **Edit** on a row to change the image or environment variables of an existing DaemonSet. The namespace and name are fixed once created, so those fields are locked in edit mode. Saving updates the DaemonSet in place, and Kubernetes rolls the change out across the nodes.

## Deleting a DaemonSet

Click **Delete** and confirm. Removing the DaemonSet tears down its pods on every node. This cannot be undone, so make sure the node-level agent is no longer needed before deleting.
