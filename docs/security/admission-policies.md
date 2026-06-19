---
title: Admission Policies
description: Control what resources can be created in the cluster using Casbin admission policies
keywords: [casos, admission, casbin, policy, kubernetes, webhook]
---

# Admission Policies

Every time you create or modify a Kubernetes resource, the API server runs the request through an admission phase before persisting it. CasOS uses [Casbin](https://casbin.org/) as a `ValidatingAdmissionWebhook` during this phase, letting you define rules that either allow or block resource operations — without writing any code.

## How admission control works in CasOS

On startup, CasOS registers a `ValidatingWebhookConfiguration` named `casbin-admission` with the API server. From that point on, whenever a resource is created, updated, or deleted, the API server calls the CasOS admission webhook at `https://127.0.0.1:<webhookPort>/admission/validate`. The webhook checks the request against the active Casbin rules and responds with allow or deny. If denied, the API server rejects the operation and returns the reason to the client.

The webhook is registered automatically and does not require any manual setup.

## Writing admission rules

Open **Security → Admission Policies** to manage rules. Each rule maps a subject (who) to a resource type in a namespace with a specific action (what), and declares whether that combination is allowed or denied.

The subject field (`v0`) identifies who the rule applies to. It can be a specific Casdoor username, a group name, or `*` to match everyone. The resource fields (`v1`, `v2`) identify the API group and resource kind — for example, API group `apps` and kind `deployments`, or API group `` (empty, for core resources) and kind `pods`. The namespace field (`v3`) scopes the rule to a namespace or `*` for all namespaces. The action field (`v4`) is the Kubernetes verb: `create`, `update`, `delete`, or `*` for all mutations.

For example, to prevent anyone from creating pods in the `default` namespace:

```
v0: *          (everyone)
v1:            (core API group)
v2: pods
v3: default    (namespace)
v4: create
v5: deny
```

Rules take effect immediately after being saved — the Casbin enforcer reloads without restarting CasOS.

## Rule ordering

Casbin evaluates rules in the order they are stored. The first matching rule wins. Put more specific rules before broader ones to get the behavior you intend. If no rule matches a request, the default is to allow it.

:::caution
A misconfigured admission policy can block all resource creation in the cluster. If you lock yourself out, stop CasOS, remove the problematic rule directly from the `casbin_rule` table in MySQL, and restart CasOS.
:::
