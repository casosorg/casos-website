---
title: Resource Quotas
description: Manage Kubernetes ResourceQuotas in CasOS
keywords: [casos, resource quota, kubernetes, access control, limits]
---

# Resource Quotas

Without constraints, a single namespace can consume all CPU and memory on the cluster and starve every other workload. A ResourceQuota prevents this by setting hard limits on what a namespace is allowed to consume. Once a limit is reached, Kubernetes rejects new resource creation in that namespace until consumption drops below the limit.

## What can be limited

ResourceQuotas can cap compute resources — total CPU requests, total CPU limits, total memory requests, total memory limits — as well as object counts such as the maximum number of pods, services, PVCs, and secrets. Compute resource quotas are the most commonly used. Object count quotas are useful for preventing accidental runaway automation.

:::info
When a ResourceQuota specifying CPU or memory limits is active in a namespace, every pod in that namespace **must** declare resource `requests` and `limits`. Pods without resource declarations are rejected. This is a Kubernetes requirement — the quota system needs declared values to track usage.
:::

## Creating a ResourceQuota

Open **Access Control → Resource Quotas** and click **Add Resource Quota**. Select the namespace you want to limit and fill in the limits you want to enforce. You do not need to set all fields — set only the ones that matter for your situation. For example, if you only care about CPU and memory, leave the pod count and service count fields blank.

## Viewing current usage

The ResourceQuota list shows each quota alongside its current consumption, so you can see at a glance how close a namespace is to its limits without needing to run `kubectl describe resourcequota`.

## Deleting a ResourceQuota

Deleting a quota removes all limits immediately. Existing workloads are not affected, but new resources can now be created without restriction.
