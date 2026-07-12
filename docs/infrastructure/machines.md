---
title: Machines
description: Register physical or virtual machines in CasOS to manage them as cluster nodes
keywords: [casos, machines, infrastructure, node, ssh, kubernetes]
---

# Machines

A **Machine** is a physical or virtual host that CasOS can connect to over SSH and manage as part of the cluster. Registering machines lets CasOS reach them directly — for example, to turn a machine into a worker node — instead of you configuring each host by hand.

Machines are managed from **Infrastructure → Machines**.

## Adding a machine

Click **Add Machine** and fill in the connection details:

| Field | Description |
|-------|-------------|
| **Name** / **Display name** | Identifier and friendly label for the machine. |
| **IP** | Address CasOS uses to reach the machine. |
| **Port** | SSH port (usually `22`). |
| **Username** | SSH user to log in as (typically `root`). |
| **Auth type** | How CasOS authenticates: **Password** or **Private key**. |
| **Password** / **Private key** | The credential matching the chosen auth type. |
| **Role** | Whether the machine is a `master` or `worker` node. |
| **Operating system** | The host's OS (for your own reference). |
| **Description** | Optional notes. |

CasOS also shows a **Status** for each machine that reflects its current state — for example `Deploying`, `Deployed`, or `Failed` once you deploy it as a node.

## Editing and deleting

Open a machine to update its connection details, then save. Deleting a machine removes it from CasOS; it does not uninstall anything already deployed on the host.

## Deploying a machine as a node

Once a machine is registered, CasOS can install the kubelet and container runtime over SSH and join it to the cluster as a worker node — see [Nodes](/docs/nodes) for the deployment flow and the SSH prerequisites the target machine must meet.
