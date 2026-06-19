---
title: Services
description: Manage Kubernetes Services in CasOS
keywords: [casos, services, kubernetes, networking, clusterip, nodeport, loadbalancer]
---

# Services

Pods come and go — they get rescheduled, restarted, and replaced. A Service gives you a stable network address that stays constant regardless of which pods are currently running behind it. Kubernetes keeps track of which pods match the Service's label selector and routes traffic to them automatically.

## Service types

**ClusterIP** is the default. It assigns a virtual IP that is only reachable from inside the cluster. Every other component in the cluster can reach the service at that IP on the specified port, but nothing outside the cluster can. This is what you want for internal-only communication between microservices.

**NodePort** exposes the service on a static port on every node's IP address. If your nodes are at `10.0.0.1` and `10.0.0.2` and you create a NodePort service on port `30080`, the service is reachable at both `10.0.0.1:30080` and `10.0.0.2:30080` from outside the cluster. NodePort is simple but puts the load balancing responsibility on you.

**LoadBalancer** provisions an external load balancer through the cloud provider. In cloud environments (AWS, GCP, Azure) this creates a real load balancer with a public IP automatically. In on-premises clusters without a cloud controller, the service stays in `Pending` state until a load balancer controller (like MetalLB) is installed.

## Creating a service

The easiest way is to click **Expose** on a Deployment — CasOS fills in the label selector automatically and you only need to choose the type and port. For services not tied to a specific deployment, click **Add Service** in the Services page and fill in the selector manually.

## Deleting a service

Deleting a service removes the stable IP and DNS name. The pods behind it are unaffected, but any clients that depended on the service address will stop being able to reach them.
