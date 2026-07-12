---
title: Helm Releases
description: Manage the lifecycle of applications installed from the CasOS App Store
keywords: [casos, helm, releases, upgrade, rollback, uninstall, history]
---

# Helm Releases

Every chart you install through the [App Store](/docs/app-store) becomes a **Helm release** — a tracked, named installation of a chart in a namespace. The Helm Releases page is where you manage that installation over its whole life: upgrade it to a new chart version or new values, review its revision history, roll it back to an earlier revision, or uninstall it entirely. It's the counterpart to the App Store: the App Store is where you *install* charts, and this page is where you *operate* what you've installed.

Open it from the **My Releases →** button in the App Store header. It routes to `/helm-releases`.

## The release list

The table lists your Helm releases with:

- **Release name** — the name you gave the installation.
- **Chart** — the chart and its version, e.g. `nginx` tagged `18.1.0`.
- **Namespace** — the namespace the release is installed in.
- **Status** — a colored badge for the release's current Helm state: **deployed** (green), **failed** (red), a **pending** state (orange) while an install, upgrade, or rollback is in progress, **superseded** (grey) for an old revision, or **uninstalling** while it is being removed.
- **App version** — the upstream application version the chart packages (distinct from the chart version).
- **Last deployed** — when the current revision was applied.

Use the namespace selector at the top to filter the list, and **Refresh** to pull the latest state. Because these are real Helm releases, the list matches what `helm list` would show against the same cluster.

## Upgrading a release

Click the **upgrade** (↑) icon on a row to open the install dialog pre-filled for that release. Change the chart **version**, edit the **values (YAML)**, or both, then confirm. CasOS runs a Helm upgrade on the backend, which creates a new revision and rolls the change out. The release stays under the same name and namespace — an upgrade never creates a second release.

## Reviewing history

Click the **history** (🕘) icon to open a drawer with the release's revision timeline. Each entry shows the revision number, the chart it deployed, its status, the timestamp, and Helm's description of what happened (for example `Upgrade complete` or `Rollback to 2`). The current, live revision is marked **deployed**; earlier revisions are **superseded**.

## Rolling back

From the history drawer, any revision that isn't the current one shows a **Rollback** button. Clicking it tells Helm to redeploy that earlier revision's chart and values. Rolling back doesn't erase history — it records a *new* revision whose contents match the old one, so you can always roll forward again. This is the fastest way to recover when an upgrade misbehaves.

## Uninstalling

Click the **delete** (🗑) icon and confirm. Uninstalling runs `helm uninstall`, which removes the release and every Kubernetes object the chart created (Deployments, Services, ConfigMaps, and so on). This cannot be undone, so make sure the application is no longer needed — and that you've preserved any data held in its PersistentVolumeClaims — before uninstalling.

:::note
Managing an application as a Helm release keeps its resources together as one unit. You can still see the individual objects a chart created on their own pages — Deployments under [Workloads](/docs/workloads/deployments), Services under [Networking](/docs/networking/services), and so on — but changing them there edits pieces of the release out from under Helm. Prefer upgrading the release when you want a change to stick across future upgrades.
:::
