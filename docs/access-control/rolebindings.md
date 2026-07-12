---
title: RoleBindings
description: Manage Kubernetes RoleBindings in CasOS
keywords: [casos, rolebinding, rbac, kubernetes, access control]
---

# RoleBindings

A RoleBinding connects a Role (a set of permissions) to a subject (a user, a group, or a ServiceAccount) within a **single namespace**. Once bound, the subject can perform the actions defined in the Role, but only on resources in that namespace.

This is different from a [ClusterRoleBinding](/docs/access-control/clusterrolebindings), which applies across the entire cluster. Use a RoleBinding when you want to scope permissions to one namespace — for example, granting a team full control of their own namespace without touching others.

A RoleBinding can also reference a ClusterRole instead of a namespaced Role. In that case the ClusterRole's permissions are applied only within the RoleBinding's namespace, which is a convenient way to reuse a common ClusterRole (such as `edit` or `view`) per namespace.

## Creating a RoleBinding

Open **Access Control → RoleBindings** and click **Add RoleBinding**. Choose the **namespace** the binding applies to, give it a name, select the Role (or ClusterRole) to grant, and add one or more subjects. Each subject has a **kind** — `ServiceAccount`, `User`, or `Group` — and a name; ServiceAccount subjects also take the namespace they live in.

For example, to let a team read and write most resources in the `team-a` namespace, create a RoleBinding in `team-a` that references the built-in `edit` ClusterRole and add the team's group as a subject.

## Deleting a RoleBinding

The subjects lose the bound permissions immediately. Running pods are not stopped, but their subsequent API calls that required those permissions will be denied by the API server.
