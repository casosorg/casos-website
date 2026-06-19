---
title: CronJobs
description: Manage Kubernetes CronJobs in CasOS
keywords: [casos, cronjobs, kubernetes, workloads, scheduled tasks]
---

# CronJobs

A CronJob runs a container on a repeating schedule. Each time the schedule fires, Kubernetes creates a Job that runs the container to completion and then exits. CronJobs are useful for periodic tasks like database backups, report generation, cache invalidation, or any work that should run on a timer rather than continuously.

## Creating a CronJob

Open **Workloads → CronJobs** and click **Add CronJob**. In addition to the usual namespace, name, and image, you need to supply a **schedule** in standard cron format.

The schedule is expressed in UTC using five fields:

```
┌─────── minute (0–59)
│ ┌───── hour (0–23)
│ │ ┌─── day of month (1–31)
│ │ │ ┌─ month (1–12)
│ │ │ │ ┌ day of week (0–6, 0=Sunday)
│ │ │ │ │
* * * * *
```

Some useful examples: `0 * * * *` runs at the top of every hour; `0 2 * * *` runs daily at 02:00 UTC; `*/15 * * * *` runs every 15 minutes; `0 9 * * 1` runs every Monday at 09:00 UTC.

:::tip
All CronJob schedules in Kubernetes are evaluated in UTC. Account for timezone offset if your task needs to fire at a specific local time.
:::

## What happens when a CronJob fires

At each scheduled time, the CronJob controller creates a Kubernetes Job. The Job creates a pod that runs your container to completion. When the container exits with code `0`, the Job is considered successful. If it exits with a non-zero code, the Job is failed and Kubernetes may retry depending on the Job's `backoffLimit`. Completed Jobs and their pods are cleaned up automatically after a short retention period.

## Deleting a CronJob

Deleting a CronJob stops all future runs. Any Jobs that are currently running continue until they complete or fail — deleting the CronJob does not kill in-flight work.
