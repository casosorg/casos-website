---
title: Authorization Policies
description: Fine-grained API authorization using Casbin authorization policies in CasOS
keywords: [casos, authorization, casbin, policy, kubernetes, webhook, rbac]
---

# Authorization Policies

Kubernetes RBAC is powerful, but it operates on roles that must be managed as Kubernetes objects. CasOS layers a Casbin-based authorization webhook on top of RBAC, letting you write policy rules as data in the CasOS UI without creating ClusterRoles and ClusterRoleBindings for every permission variation.

## How authorization differs from admission

[Admission Policies](/docs/security/admission-policies) intercept resource mutations (create, update, delete) after authorization has already passed. Authorization Policies operate earlier — during the authorization phase — which means they can also control read operations like `get`, `list`, and `watch`. If you want to prevent a user from reading Secrets at all, you need an authorization policy, not an admission policy.

## When the webhook is active

CasOS switches the API server into `Node,RBAC,Webhook` mode automatically when at least one authorization rule exists. When no rules are present, the API server uses `Node,RBAC` only and does not call the webhook. This means adding your first rule changes the authorization mode — plan for this before adding rules in a production cluster.

A request passes authorization only when both RBAC and the Casbin webhook allow it. The webhook cannot grant permissions that RBAC does not allow; it can only further restrict them.

## Writing authorization rules

Open **Security → Authorization Policies**. The rule structure is the same as admission policies — subject, API group, resource kind, namespace, verb, and effect — but the verb field now includes read operations: `get`, `list`, `watch`, `create`, `update`, `patch`, `delete`, and `*` for everything.

For example, to deny the `developer` group all access to Secrets while keeping `admin` access intact:

```
v0: developer    v2: secrets    v4: *    v5: deny
v0: admin        v2: secrets    v4: *    v5: allow
```

Both rules apply to all namespaces (`v3: *`) and the core API group (`v1: ""`). The `developer` rule is listed first so it matches before the broader wildcard.

## Deleting rules

Click **Delete** on any rule. The enforcer reloads immediately. If deleting the last rule, the API server switches back to `Node,RBAC` mode — the webhook is no longer consulted.
