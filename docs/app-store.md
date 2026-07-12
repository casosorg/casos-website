---
title: App Store
description: Browse and install Helm charts from public repositories in the CasOS App Store
keywords: [casos, app store, helm, charts, repositories, artifacthub, install]
---

# App Store

The App Store is a browser for [Helm](https://helm.sh) charts. Instead of a small set of hand-maintained templates, it connects to public chart repositories — including ArtifactHub's catalog of thousands of charts — and installs them into your cluster as managed Helm releases. Pick a chart, review its values, and install it; CasOS runs Helm on the backend and tracks the result as a release you can later upgrade, roll back, or uninstall.

## Choosing a source

A sidebar on the left lists the chart **sources** you can browse. CasOS ships with several presets:

| Source | What it is |
|--------|------------|
| **ArtifactHub** | The [artifacthub.io](https://artifacthub.io) index — 8,000+ charts aggregated from across the ecosystem. |
| **Bitnami** | Bitnami's ~200 curated, production-hardened charts. |
| **Rancher** | The Rancher chart repository. |
| **ingress-nginx** | The official `ingress-nginx` chart repository. |

Click a source to browse its charts. ArtifactHub is searched live across every repository it indexes; the other presets load the full chart list from a single repository's index.

## Searching and browsing

Each chart appears as a card showing its icon, name, version, and a short description. Use the search box at the top to filter:

- On **ArtifactHub**, the search term is sent to the ArtifactHub API and matched across all indexed charts, with results paged in as you scroll.
- On a **single repository**, the search filters the already-loaded chart list by name and description locally.

Click **Refresh** to reload the current source.

## Adding your own repository

To install from a private or third-party repository that isn't in the presets, click **Add Repo** in the sidebar and enter a name and the repository's URL (for example `https://charts.example.com`). It's saved under **My Repos** in the sidebar and can be browsed like any preset. Remove a custom repository with the delete icon next to its name.

## Installing a chart

Click **Install** on a chart card to open the install dialog. Fill in:

- **Release name** — a name for this installation, unique within the namespace. It must be lowercase and may contain letters, numbers, and hyphens. It defaults to the chart name.
- **Namespace** — the namespace to install into. CasOS loads the available namespaces and defaults to `default`.
- **Version** — the chart version to install. Leave it blank to use the latest.
- **Values (YAML)** — the chart's configuration. CasOS fetches the chart's default `values.yaml` and shows it in an editable text area, so you can review every setting and override just the ones you need before installing.

Click **Install**. CasOS runs the Helm install on the backend and, on success, the application appears on the [Helm Releases](/docs/helm-releases) page. From there you can upgrade it, view its revision history, roll it back, or uninstall it.

:::tip
The values editor is pre-filled with the chart's real defaults, not a blank box. The safest way to customize an install is to change only the keys you care about — image tags, resource limits, ingress hostnames — and leave the rest as the chart author intended.
:::

## Managing installed applications

Everything you install through the App Store is a Helm release. Manage the full lifecycle — upgrades, rollbacks, history, and uninstalls — on the [Helm Releases](/docs/helm-releases) page, reachable from the **My Releases →** button in the App Store header. The individual Kubernetes objects a chart creates (Deployments, Services, and so on) also show up on their respective pages, but managing the release as a unit keeps related resources together.
