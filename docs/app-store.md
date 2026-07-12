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

Click **Install**. The dialog switches to a live console that streams the Helm install log line by line as the backend works, so you can watch the release come up instead of waiting on a spinner. When the install succeeds, the final line turns green and a **Done** button appears — click it to close the dialog and find the application on the [Helm Releases](/docs/helm-releases) page, where you can upgrade it, view its revision history, roll it back, or uninstall it. If the install fails, the error is shown inline in red so you can read exactly what Helm reported.

CasOS considers the install finished once Helm has created the release's Kubernetes objects — it does not block waiting for every Pod to become ready. A chart that pulls large images or waits on storage can still be settling after the dialog reports success; watch the release's status on [Helm Releases](/docs/helm-releases), or the individual objects on their own pages, to see when everything is actually running.

### Aborting an install

While an install is in progress the dialog stays open — you can't dismiss it by clicking outside — and shows an **Abort** button next to the log. Click **Abort** to cancel: CasOS stops the backend operation instead of leaving it running after you've walked away. Because Kubernetes objects are created as the install proceeds, aborting part-way can leave a partially created release behind, and CasOS warns you when it does. If you see that warning, uninstall the release from [Helm Releases](/docs/helm-releases) to clean up whatever was created before trying again.

:::tip
The values editor is pre-filled with the chart's real defaults, not a blank box. The safest way to customize an install is to change only the keys you care about — image tags, resource limits, ingress hostnames — and leave the rest as the chart author intended.
:::

If the chart's default values can't be loaded — the repository is unreachable, or the chart archive is malformed — the install dialog shows the error inline instead of presenting an empty editor, so you know the values you're about to install with aren't the real defaults.

## Fetching charts through a proxy

CasOS downloads repository indexes and chart archives with a Helm-compatible HTTP client that honors the optional outbound proxy. If you've set `socks5Proxy` in the [configuration](/docs/configuration#optional-outbound-proxy), chart browsing and installs route through it automatically — the same way the platform reaches container registries. This is what lets the App Store reach public chart repositories from clusters whose egress is restricted to a proxy.

The client also identifies itself with a standard Helm `User-Agent`, so repositories that reject or throttle generic HTTP clients serve CasOS the same responses they'd give the `helm` CLI.

## Troubleshooting

**A chart you expect isn't listed, or install fails with "chart not found."** Some repositories publish index files that CasOS's parser previously couldn't read fully, so charts appeared to be missing. CasOS now parses repository indexes the same way Helm itself does, so charts that used to be skipped show up and install normally. Click **Refresh** on the source to re-fetch its index.

**Browsing a repository shows fewer charts than the repository advertises.** A repository's `index.yaml` can contain legacy or malformed entries with missing metadata. Rather than failing the whole listing, CasOS skips only the unreadable entries and shows the rest, so one bad entry no longer blocks an entire source from loading.

**A repository won't load at all.** Confirm the URL points at a Helm repository root (the directory containing `index.yaml`, e.g. `https://charts.example.com`, not a link to a specific chart). If the repository is only reachable through your network's proxy, make sure `socks5Proxy` is configured as described above.

## Managing installed applications

Everything you install through the App Store is a Helm release. Manage the full lifecycle — upgrades, rollbacks, history, and uninstalls — on the [Helm Releases](/docs/helm-releases) page, reachable from the **My Releases →** button in the App Store header. The individual Kubernetes objects a chart creates (Deployments, Services, and so on) also show up on their respective pages, but managing the release as a unit keeps related resources together.
