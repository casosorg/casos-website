---
title: Ingress
description: Manage Kubernetes Ingress rules in CasOS
keywords: [casos, ingress, kubernetes, networking, http, routing]
---

# Ingress

A Service of type `NodePort` or `LoadBalancer` exposes one service at a time. An Ingress is different — it is a single entry point that routes HTTP and HTTPS traffic to different backend services based on the hostname and URL path. One Ingress can replace dozens of NodePort services.

For example, a single Ingress can route `app.example.com/api` to the API service and `app.example.com/` to the frontend service, using a single external IP and port 80/443.

## Prerequisites

Ingress resources are just configuration. They have no effect until an **Ingress controller** is installed in the cluster to read them and actually do the routing. CasOS does not install an Ingress controller automatically. [ingress-nginx](https://kubernetes.github.io/ingress-nginx/) is the most common choice:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.10.0/deploy/static/provider/cloud/deploy.yaml
```

Once the controller is running, any Ingress resources you create in CasOS will be picked up and applied.

## Creating an Ingress

Open **Networking → Ingress** and click **Add Ingress**. You specify the namespace, a name, and an Ingress class name that must match your installed controller (usually `nginx`). Then add one or more routing rules. Each rule combines a hostname, a URL path, a path type, and a backend service name and port.

**Path type** controls how the path is matched. `Prefix` matches any URL that starts with the given path, so `/api` would also match `/api/users`. `Exact` matches only the literal path. `ImplementationSpecific` delegates the matching logic to the controller.

## Deleting an Ingress

Deleting an Ingress removes all the routing rules it defined. The backend services continue running and are still reachable by other means (ClusterIP, NodePort), but the Ingress entry point stops working.
