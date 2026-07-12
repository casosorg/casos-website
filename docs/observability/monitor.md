---
title: Monitor Center
description: A one-page cluster health overview with automated checks and a live event feed in CasOS
keywords: [casos, monitor, health checks, cluster health, events, observability, kubernetes]
---

# Monitor Center

The Monitor Center is a single page that answers one question — *is my cluster healthy right now?* — without making you piece the answer together from a dozen resource lists. It pulls a fresh snapshot of the cluster, runs a set of automated health checks against it, and lays the results out as summary tiles, a checks table, and a live feed of recent Kubernetes events.

Find it under **Observability → Monitor Center**.

## The summary tiles

The top of the page is a row of at-a-glance tiles, each computed from the same snapshot:

| Tile | What it shows |
|------|---------------|
| **Overall Status** | The worst status across every health check — `Healthy`, `Warning`, `Critical`, or `Unknown`. |
| **Ready Nodes** | Ready nodes over total registered nodes. |
| **Running Pods** | Running pods over total pods across all namespaces. |
| **Abnormal Pods** | Pods that are failing, pending on an error, crash-looping, or otherwise not making progress. |
| **Warning Events** | How many `Warning`-type events are in the recent event window. |
| **Critical Checks** | Health checks currently reporting `Critical`. |
| **Warning Checks** | Health checks currently reporting `Warning`. |

The **Overall Status** rolls the individual checks up with a worst-wins rule: any critical check makes the whole cluster `Critical`, any warning makes it `Warning`, an unresolved `Unknown` check makes it `Unknown`, and only when everything passes does it read `Healthy`.

## Health checks

Below the tiles is a table of the checks CasOS runs on every refresh. Each row carries a **Status** and **Severity** tag, a plain-language **Message** describing what was found, and a **Suggestion** pointing you at the likely fix — so a red row usually tells you both what broke and where to look next.

| Check | Category | What it verifies |
|-------|----------|------------------|
| **Kubernetes API Server Connectivity** | cluster | The control plane's API server is reachable. |
| **Node Ready Check** | node | Every registered node reports `Ready`; a cluster with no Ready nodes is critical. |
| **Node Pressure Check** | node | No node is under memory, disk, PID, or network pressure. |
| **Pod Abnormal Status Check** | pod | No pods are failed, stuck pending, image-pull-failing, or crash-looping. |
| **System Component Check** | system | The recognized `kube-system` components (CoreDNS, kube-proxy, and friends) are available; a down CoreDNS is treated as critical. |
| **PVC Bound Check** | storage | Every PersistentVolumeClaim has reached `Bound`. |
| **Kubernetes Warning Event Check** | event | There are no recent `Warning` events in the cluster. |
| **CasOS Backend and Database Check** | casos | The CasOS backend is alive and its database responds to a ping. |

A healthy check stays quiet with a short "no action required" message; the checks that matter are the ones that turn yellow or red.

## Event Center

The bottom section is a live feed of recent Kubernetes events — the same stream `kubectl get events` surfaces, sorted newest-first. Each row shows the event's time, type (`Normal` or `Warning`), namespace, involved object, reason, message, and how many times it has fired. Click **Details** on any row to open the full event, including its source and reporting controller.

Use the **namespace** filter to narrow the feed to a single namespace, or leave it blank to watch the whole cluster. Warning events are the ones worth scanning first — an image that won't pull, a pod that keeps restarting, or a volume that won't attach all announce themselves here before they show up as a failing workload.

## Refreshing

Every load takes a new snapshot, so the tiles, checks, and events always reflect the cluster's current state rather than a cached view. Refresh the page (or the event feed on its own) whenever you want the latest reading — for example right after deploying something, to confirm it came up clean.

## Related

- [Resource Topology](/docs/observability/topology) — see how the resources in a namespace connect.
- [Log Search](/docs/logs) — dig into container logs once a check points you at a misbehaving pod.
- [Nodes](/docs/nodes) — inspect node health and capacity in detail.
