---
title: Horizontal Pod Autoscaler
description: Automatically scale Deployments based on CPU utilization using HPA in CasOS
keywords: [casos, hpa, horizontal pod autoscaler, kubernetes, autoscaling]
---

# Horizontal Pod Autoscaler

A HorizontalPodAutoscaler (HPA) watches a Deployment or StatefulSet and adjusts its replica count automatically based on resource utilization. When the workload gets busier, the HPA adds replicas. When it quiets down, the HPA removes them. This lets the cluster use resources efficiently without manual intervention.

## Prerequisites

HPA relies on the **metrics-server** to read live CPU and memory utilization from the kubelets. Without it, the HPA controller cannot make scaling decisions and the HPA stays at its minimum replica count. Install metrics-server before creating any HPAs:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

## How CPU-based scaling works

You specify a target CPU utilization percentage — for example, 60%. The HPA measures the average CPU usage across all current replicas as a fraction of each pod's `requests.cpu`. If the average rises above 60%, it calculates how many replicas are needed to bring the average back to 60% and creates that many. If it drops well below 60% and has been below for a sustained period, it scales back down.

The HPA respects the `minReplicas` and `maxReplicas` bounds you set. It will never scale below the minimum (so the service always has some capacity) and never above the maximum (so a traffic spike cannot exhaust the cluster).

## Creating an HPA

Open **HPAs** and click **Add HPA**. Select the namespace and provide a name. Choose whether to target a Deployment or a StatefulSet, and enter its name. Then set the min replicas, max replicas, and target CPU utilization percentage.

For example, to keep a Deployment between 2 and 10 replicas while targeting 60% average CPU:

```
Scale Target:   Deployment/my-app
Min Replicas:   2
Max Replicas:   10
CPU Target:     60
```

When average CPU across all `my-app` pods exceeds 60% of their CPU request, Kubernetes adds replicas. When it stays below 60% for several minutes, replicas are removed down to the minimum of 2.

## Scale-down delay

By default, Kubernetes waits until CPU has been consistently low for about 5 minutes before scaling down. This prevents flapping when traffic oscillates around the threshold. The **Desired** counter in the HPA list shows what the HPA wants right now, while **Current** shows the actual replica count — they converge once the delay has passed.

## Deleting an HPA

When you delete an HPA, the Deployment or StatefulSet keeps its current replica count permanently. It will no longer be automatically adjusted. You can scale it manually from the Workloads page.
