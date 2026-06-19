---
title: Network Policies
description: Manage Kubernetes NetworkPolicies in CasOS
keywords: [casos, network policy, kubernetes, networking, security]
---

# Network Policies

By default, every pod in a Kubernetes cluster can talk to every other pod, across namespaces. A NetworkPolicy changes that. It selects a group of pods and specifies exactly which ingress (inbound) and egress (outbound) traffic is allowed. Traffic that is not explicitly allowed is denied.

NetworkPolicies are additive — if multiple policies select the same pod, the pod is allowed any traffic permitted by any of those policies. The only way to deny traffic is the absence of a matching allow rule, not an explicit deny.

:::info
NetworkPolicies are enforced by the CNI plugin, not Kubernetes itself. Your cluster's CNI must support NetworkPolicy enforcement. Calico, Cilium, and Weave Net all do. If you use a CNI that does not (like Flannel without a policy add-on), NetworkPolicy objects can be created but have no effect.
:::

## Creating a network policy

Open **Networking → Network Policies** and click **Add Network Policy**. The pod selector determines which pods the policy applies to — leave it empty to apply the policy to every pod in the namespace. Then choose whether to restrict ingress traffic, egress traffic, or both, and add rules for the traffic you want to allow.

A useful pattern is to start with a default-deny policy (empty pod selector, policy type listed but no rules) and then add explicit allow rules. This is more secure than starting open and trying to add restrictions later.

For example, to deny all ingress to a namespace, create a policy with an empty pod selector, set policy type to `Ingress`, and add no ingress rules. Every pod in that namespace will then block all inbound traffic unless another NetworkPolicy explicitly allows it.

## Deleting a network policy

When you delete a NetworkPolicy, the pods it selected immediately revert to whatever the remaining policies (if any) allow. If no other policies select those pods, they revert to open communication with the rest of the cluster.
