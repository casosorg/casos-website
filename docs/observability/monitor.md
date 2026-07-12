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

## Monitor Issues

The health checks tell you *that* something is wrong at the cluster level; the **Monitor Issues** table below them turns that into a list of specific, actionable problems — one row per affected object rather than one per check. CasOS derives the list from the same snapshot: a node that isn't `Ready`, a pod that's crash-looping or stuck pending, a PVC that never bound, an unavailable CoreDNS, and recent warning events that don't already belong to one of those objects each become an issue. Every row carries a **Severity**, the **Object** it concerns, a **Reason**, a **Message**, a **Suggestion**, and when it was **Last Seen**, and the list is sorted worst-first so the most urgent problems sit at the top. If an object already has a first-class issue, a warning event about the same object is folded into it instead of adding a duplicate row.

### Diagnosing an issue

Click **Diagnosis** on any issue to open the **Diagnosis Context** drawer, which gathers everything you'd otherwise collect by hand into one place:

- **The issue** — its object, severity, reason, message, suggestion, and last-seen time, laid out as a summary at the top.
- **Related events** — the recent Kubernetes events for that specific object, so you can see the sequence that led to the current state.
- **Log preview** — for a Pod, the tail of its container logs. CasOS shows both the **Current** logs and, when available, the **Previous** container's logs (tagged so you can tell them apart), which is what you want when a container has already restarted and the useful output is in the instance that died.
- **Diagnosis** — a compact, structured context block summarizing the issue, the object's identity, the signals CasOS observed, the evidence it collected (events and log previews), and the suggested actions. It's assembled in a machine-readable shape so you can hand it straight to an AI assistant or paste it into a ticket without hand-writing a summary.

If you open the drawer for an object that has no active issue, CasOS says so plainly rather than inventing a problem — the diagnosis still pulls the object's events and logs, so it doubles as a quick way to inspect any object the monitor knows about.

## Event Center

The bottom section is a live feed of recent Kubernetes events — the same stream `kubectl get events` surfaces, sorted newest-first. Each row shows the event's time, type (`Normal` or `Warning`), namespace, involved object, reason, message, and how many times it has fired. Click **Details** on any row to open the full event, including its source and reporting controller.

Use the **namespace** filter to narrow the feed to a single namespace, or leave it blank to watch the whole cluster. Warning events are the ones worth scanning first — an image that won't pull, a pod that keeps restarting, or a volume that won't attach all announce themselves here before they show up as a failing workload.

## Refreshing

Every load takes a new snapshot, so the tiles, checks, and events always reflect the cluster's current state rather than a cached view. Refresh the page (or the event feed on its own) whenever you want the latest reading — for example right after deploying something, to confirm it came up clean.

## Related

- [Resource Topology](/docs/observability/topology) — see how the resources in a namespace connect.
- [Log Search](/docs/logs) — dig into container logs once a check points you at a misbehaving pod.
- [Nodes](/docs/nodes) — inspect node health and capacity in detail.
