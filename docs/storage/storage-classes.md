---
title: Storage Classes
description: Define how CasOS provisions persistent storage by managing Kubernetes StorageClasses
keywords: [casos, storage class, provisioner, dynamic provisioning, pvc, kubernetes, storage]
---

# Storage Classes

A StorageClass describes *how* a piece of storage gets provisioned. When a [PersistentVolumeClaim](/docs/storage/pvcs) asks for storage, Kubernetes looks at the StorageClass it names — or the cluster's default — to decide which provisioner creates the volume, what reclaim policy it gets, and when it is bound. A cluster with a working default StorageClass can satisfy PVCs automatically; without one, claims sit in `Pending` until a volume is created by hand.

## Viewing Storage Classes

Open **Storage → Storage Classes**. The list shows every StorageClass in the cluster with its provisioner, reclaim policy, volume binding mode, whether volume expansion is allowed, and its creation time. The class currently marked as the cluster default carries a gold **Default** tag next to its name. Click **Refresh** to re-fetch the list from the API server.

## Creating a Storage Class

Click **Add** and fill in the dialog:

- **Name** — a unique name for the StorageClass (for example `local-path` or `fast-ssd`).
- **Provisioner** — the volume plugin that creates the underlying storage, such as `casos.io/local-path-provisioner`. This is what actually talks to the storage backend.
- **Reclaim Policy** — what happens to a provisioned volume when its claim is deleted: **Delete** removes the volume, **Retain** keeps it for manual cleanup.
- **Volume Binding Mode** — **Immediate** binds a volume as soon as the claim is created; **WaitForFirstConsumer** delays binding until a pod that uses the claim is scheduled, so the volume lands on the right node.
- **Allow Volume Expansion** — whether PVCs using this class can later be resized to request more space.
- **Set As Default** — mark this class as the cluster default, used by any PVC that doesn't name a StorageClass explicitly.
- **Parameters** — arbitrary key/value pairs passed to the provisioner (the accepted keys depend on which provisioner you chose). Add as many rows as the backend needs.

Click **Create** to create the class.

:::note
CasOS enforces that only one StorageClass is the default at a time. When you mark a class as default, the default flag is cleared from whichever class held it before, so PVCs never face two competing defaults.
:::

## Editing a Storage Class

Click **Edit** on any row to change its settings. A StorageClass's core fields are immutable in Kubernetes once created, so the dialog only lets you change what the API actually allows — the **Reclaim Policy**, **Allow Volume Expansion**, and the **Set As Default** flag. The name, provisioner, volume binding mode, and parameters are fixed at creation time; to change any of those, delete the class and create a new one.

## Deleting a Storage Class

Click **Delete** on a row and confirm. Deleting a StorageClass does not delete volumes that were already provisioned through it, but new PVCs can no longer reference it. Take care not to delete the class your PVCs depend on — and if you delete the default, remember to mark another class as default so future claims can still be provisioned automatically.

## Related

- [Persistent Volume Claims](/docs/storage/pvcs) — request storage that a StorageClass provisions.
