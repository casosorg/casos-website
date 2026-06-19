---
title: Persistent Volume Claims
description: Manage PersistentVolumeClaims in CasOS
keywords: [casos, pvc, persistent volume, kubernetes, storage]
---

# Persistent Volume Claims

Container filesystems are ephemeral — when a pod is deleted or rescheduled, everything written inside the container is lost. A PersistentVolumeClaim (PVC) is how a pod requests durable storage that outlives any individual pod.

The PVC describes what you need (how much space, which access modes), and Kubernetes finds or provisions a PersistentVolume (PV) that satisfies those requirements. If a StorageClass with a dynamic provisioner is configured, the PV is created automatically when the PVC is created.

## Access modes

A PVC declares how it will be mounted:

- `ReadWriteOnce` — mounted as read/write by a single node at a time. This is the most common mode and works with most storage backends.
- `ReadOnlyMany` — mounted as read-only by many nodes simultaneously. Useful for shared config data.
- `ReadWriteMany` — mounted as read/write by many nodes simultaneously. Requires a storage backend that supports shared writes, such as NFS or a distributed filesystem.

## Creating a PVC

Open **Storage → Persistent Volumes** and click **Add PVC**. Specify the namespace, a name, the StorageClass, the requested capacity (e.g. `10Gi`), and the access mode. The PVC will be in `Pending` state until a matching PV is available. With dynamic provisioning this usually takes a few seconds.

## Attaching a PVC to a workload

Go to **Workloads → Deployments**, click **Storage** on the deployment you want to attach it to, and select the PVC along with the mount path inside the container. For StatefulSets, each pod can have its own PVC through `volumeClaimTemplates` — see [StatefulSets](/docs/workloads/statefulsets).

## Deleting a PVC

Before deleting a PVC, make sure no running pod is using it. Deleting a mounted PVC causes the pod to lose access to the volume, which typically crashes the container. What happens to the underlying PV depends on the StorageClass's `reclaimPolicy`: `Retain` keeps the PV and its data for manual recovery; `Delete` removes both the PV and the underlying storage.

:::caution
Deleting a PVC is not reversible. If `reclaimPolicy` is `Delete`, the data on the volume is permanently destroyed.
:::
