---
title: Jobs
description: Run one-off and batch workloads to completion with Kubernetes Jobs in CasOS
keywords: [casos, jobs, batch, kubernetes, workloads]
---

# Jobs

A Job runs one or more pods until a specified number of them complete successfully, then stops. Unlike a Deployment — which keeps its pods running indefinitely and restarts them when they exit — a Job is for work that has an end: a database migration, a batch import, a one-off cleanup, or any task that should run to completion and then be done. If a [CronJob](/docs/workloads/cronjobs) is a task on a timer, a Job is the single run that a CronJob creates each time it fires.

## Viewing Jobs

Open **Workloads → Jobs**. The list spans every namespace and shows each Job's namespace, name, container image, completion target, and creation time. The **Status** column summarizes the Job's pods with colored tags — **Active** (blue) for pods still running, **Succeeded** (green) for pods that finished with exit code `0`, and **Failed** (red) for pods that errored out. A Job with no pods yet shows **Pending**. Click **Refresh** to pull the latest state from the API server.

## Creating a Job

Click **Add** and fill in the dialog:

- **Namespace** — the namespace to create the Job in.
- **Name** — a unique name within the namespace.
- **Image** — the container image to run, e.g. `busybox:latest`.
- **Command** — optional; a space-separated command to run in the container, e.g. `sh -c "echo hello"`. Leave it empty to use the image's default entrypoint.
- **Container Name** — optional; leave it empty to reuse the Job name as the container name.

Three fields control how the Job runs to completion:

- **Completions** — how many pods must finish successfully before the Job is considered complete (default `1`).
- **Parallelism** — how many pods may run at the same time (default `1`). Raising this runs the work concurrently; for example, `completions: 10` with `parallelism: 3` runs ten pods, three at a time.
- **Backoff Limit** — how many times a failed pod is retried before the whole Job is marked failed (default `6`).

Click **Create** to submit. Kubernetes schedules the pods and the Job's status updates as they run and finish.

## Editing a Job

Click **Edit** on a row to change the image, command, or completion settings of an existing Job. The namespace and name are fixed once created, so those fields are locked in edit mode.

:::note
A Job's pod template is immutable in Kubernetes once pods have been created. Editing is most useful before the Job finishes, or for adjusting the retry and completion bounds. For a fresh run with different parameters, delete the Job and create a new one.
:::

## Deleting a Job

Click **Delete** and confirm. Removing a Job also removes the pods it created, including their logs. If the Job is still running, its in-flight pods are terminated. This cannot be undone, so retrieve any logs you need before deleting.
