---
title: StatefulSets
description: Manage Kubernetes StatefulSets in CasOS
keywords: [casos, statefulsets, kubernetes, workloads]
---

# StatefulSets

A StatefulSet is like a Deployment, but each pod gets a stable, permanent identity. Pod `my-db-0` is always `my-db-0` — it keeps its hostname and its storage even if it is restarted or rescheduled to another node. This makes StatefulSets the right choice for databases, message queues, and any workload that needs to remember which replica is which.

The key differences from a Deployment are:

- Pods are created in order (`-0`, `-1`, `-2`, …) and deleted in reverse order when you scale down.
- Each pod gets a stable DNS name: `<name>-<ordinal>.<headless-service>.<namespace>.svc.cluster.local`.
- `volumeClaimTemplates` can provision a separate PersistentVolumeClaim for each pod automatically.

## Creating a StatefulSet

Open **Workloads → StatefulSets** and click **Add StatefulSet**. The form is identical to the Deployment form: namespace, name, image, replica count, env vars, and volume mounts. The difference is in how Kubernetes handles those pods once created.

## Scaling

Scaling a StatefulSet up adds pods starting from the next ordinal. Scaling down removes pods from the highest ordinal first. CasOS applies the change immediately, but Kubernetes processes each pod sequentially — it waits for one pod to be ready before starting the next.

## Updating

Click the edit icon to change the image, env vars, or volumes. StatefulSets use a `RollingUpdate` strategy: pods are updated one at a time, from the highest ordinal down to `0`. The pod at ordinal `0` is updated last, which is useful when one replica acts as a leader.

## Storage

If you used `volumeClaimTemplates` to give each pod its own PVC, those PVCs are **not** deleted when you delete the StatefulSet or scale it down. This is intentional — Kubernetes preserves the data so you can scale back up and the pods reconnect to their original storage. Delete the PVCs explicitly if you no longer need the data.
