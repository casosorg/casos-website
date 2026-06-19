---
title: ClusterRoleBindings
description: Manage Kubernetes ClusterRoleBindings in CasOS
keywords: [casos, clusterrolebinding, rbac, kubernetes, access control]
---

# ClusterRoleBindings

A ClusterRoleBinding connects a ClusterRole (a set of permissions) to a subject (a user, a group, or a ServiceAccount) and applies that connection across the entire cluster. Once bound, the subject can perform the actions defined in the ClusterRole on any resource in any namespace.

This is different from a RoleBinding, which scopes permissions to a single namespace. Use ClusterRoleBindings when you need cluster-wide access — for operators, monitoring agents, CI/CD systems, or administrative users.

## Built-in ClusterRoles

Kubernetes ships with several ClusterRoles ready to use. `cluster-admin` is the superuser role — it allows any action on any resource. `admin` grants full namespace-scoped control and is typically used with RoleBindings, not ClusterRoleBindings. `edit` allows creating, updating, and deleting most resources but not modifying RBAC. `view` is read-only access to most resources but excludes Secrets.

For most use cases, binding a ServiceAccount to `cluster-admin` is too broad. Prefer creating a custom ClusterRole with only the specific verbs and resources your application needs.

## Creating a ClusterRoleBinding

Open **Access Control → ClusterRoleBindings** and click **Add ClusterRoleBinding**. Give it a name, choose the ClusterRole you want to grant, and add one or more subjects. A subject can be a user (identified by their Casdoor username), a group, or a ServiceAccount (identified as `<namespace>/<name>`).

For example, to let a monitoring agent list pods and nodes across the whole cluster, create a ClusterRole with `get` and `list` on `pods` and `nodes`, then bind your monitoring ServiceAccount to it.

## Deleting a ClusterRoleBinding

The subjects lose the bound permissions immediately. Running pods are not stopped, but their subsequent API calls that required those permissions will be denied by the API server.
