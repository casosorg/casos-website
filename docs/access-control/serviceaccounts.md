---
title: Service Accounts
description: Manage Kubernetes ServiceAccounts in CasOS
keywords: [casos, service accounts, kubernetes, access control, rbac]
---

# Service Accounts

When a pod needs to talk to the Kubernetes API — to list other pods, update a ConfigMap, or watch for resource changes — it needs an identity. That identity is a ServiceAccount. Every pod runs as exactly one ServiceAccount, and that account determines what the pod is allowed to do via RBAC.

Every namespace has a `default` ServiceAccount created automatically. Pods that do not specify a `serviceAccountName` use it. The `default` ServiceAccount has no extra permissions — it can only do what the anonymous user can do — which is almost nothing. If your application needs to call the Kubernetes API, create a dedicated ServiceAccount and grant it only the permissions it needs.

## Creating a ServiceAccount

Open **Access Control → Service Accounts** and click **Add Service Account**. Specify the namespace and a name. The ServiceAccount is created immediately. It has no permissions yet — add those by creating a [ClusterRoleBinding](/docs/access-control/clusterrolebindings) that references this ServiceAccount as a subject.

## Using a ServiceAccount in a pod

Reference the ServiceAccount in your Deployment spec:

```yaml
spec:
  serviceAccountName: my-service-account
```

Kubernetes automatically mounts the ServiceAccount token at `/var/run/secrets/kubernetes.io/serviceaccount/token` inside the container. The Kubernetes client libraries read this file automatically and use it to authenticate API calls.

## Deleting a ServiceAccount

Deleting a ServiceAccount does not stop running pods that use it, but those pods lose their API access immediately. Any new pods that reference the deleted ServiceAccount will fail to start.
