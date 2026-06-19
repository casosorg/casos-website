---
title: Deployments
description: Manage Kubernetes Deployments in CasOS
keywords: [casos, deployments, kubernetes, workloads]
---

# Deployments

A Deployment tells Kubernetes to keep a certain number of identical pod replicas running at all times. If a pod crashes, the Deployment controller starts a replacement. If you update the image, it rolls out the change pod by pod so that the service stays available. Deployments are the right choice for stateless workloads like web servers, API services, and background workers.

## Creating a deployment

Open **Workloads → Deployments** and click **Add Deployment**. You need to specify the namespace, a name, and a container image. The image can be typed in directly (e.g. `nginx:1.27`) or browsed from DockerHub using the built-in image browser. Replica count defaults to `1`; raise it for redundancy.

You can also set environment variables and volume mounts at creation time. Volumes can be backed by a ConfigMap (for config files) or a Secret (for credentials). These are added as Kubernetes volume mounts inside the container.

## Updating a deployment

Click the edit icon on any deployment row to open the full editor. From there you can change the image, replica count, env vars, and volume mounts.

If you only need to change the image — the most common update — use the **Update Image** button instead of the full editor. It shows a single input pre-filled with the current image tag, which you update and confirm. This triggers a rolling update: Kubernetes brings up a pod on the new image before taking down one on the old image, so the service stays available throughout.

## Scaling

The replica counter next to each deployment row lets you scale up or down without opening the editor. Click ▲ or ▼ and the change takes effect immediately. Use this for quick manual scaling; for automatic scaling based on CPU load, see [Horizontal Pod Autoscaler](/docs/hpa).

## Exposing a deployment

Click **Expose** on a deployment to create a Service that routes traffic to its pods. You choose the Service type: `ClusterIP` for internal-only access, `NodePort` to reach the service on a port of every node, or `LoadBalancer` when your environment provides a cloud load balancer. CasOS fills in the pod selector automatically from the deployment's labels.

## Attaching persistent storage

Click **Storage** on a deployment to mount a PersistentVolumeClaim. Provide the PVC name and the path inside the container where the volume should appear. This is how you give a deployment durable storage that survives pod restarts.

## Viewing logs

Click **Logs** on any deployment row to jump to the [Log Search](/docs/logs) page pre-filtered for that deployment. Logs are aggregated from all replicas, so you see a single stream rather than having to switch between pods.

## Deleting a deployment

Click **Delete** to remove the Deployment and its underlying ReplicaSets. The pods are garbage-collected shortly after. This cannot be undone, so make sure you no longer need the workload before deleting.
