---
slug: /
title: Overview
description: CasOS Overview
keywords: [casos, kubernetes, cloud os]
---

# Overview

CasOS is a cloud operating system built on Kubernetes. It embeds the full Kubernetes control plane — API server, controller manager, and scheduler — inside a single Go binary, so you do not need an existing cluster, a separate etcd installation, or any Kubernetes bootstrap tooling. Run one binary, point it at a MySQL database, and you have a fully functional cloud OS with a built-in web UI.

The live demo is available at [https://casos.casnode.com](https://casos.casnode.com).

## What problem it solves

Setting up a Kubernetes cluster typically involves installing etcd, bootstrapping the API server, joining nodes with `kubeadm`, and managing TLS certificates across multiple processes. CasOS collapses all of this into a single process. MySQL replaces etcd (via [kine](https://github.com/k3s-io/kine)), TLS certificates are generated automatically on first start, and the control plane components start in the same process as the web UI. The result is a Kubernetes environment you can stand up in minutes, not hours.

## What you can do with it

From the web UI you can manage the full lifecycle of Kubernetes workloads: create Deployments, StatefulSets, and CronJobs; scale them up and down; roll out new images; attach persistent storage; expose them through Services and Ingress rules. You can also manage the supporting infrastructure — Namespaces, ConfigMaps, Secrets, ServiceAccounts, NetworkPolicies, and ResourceQuotas — all without `kubectl`.

For security, CasOS adds two layers on top of standard Kubernetes RBAC: a [Casbin admission webhook](/docs/security/admission-policies) that can block specific resource operations, and a [Casbin authorization webhook](/docs/security/authorization-policies) that can restrict who can read or write any resource. [Trivy image scanning](/docs/security/trivy) is built in so you can check container images for known CVEs before deploying.

All authentication is handled by [Casdoor](https://casdoor.org), which means you can connect any identity provider Casdoor supports — Google, GitHub, LDAP, SAML, and more — without any changes to CasOS.

## Architecture at a glance

CasOS is written in Go. The backend uses the [Beego](https://beego.vip/) framework. The frontend is React 18 with Ant Design. Kubernetes state lives in MySQL alongside application data, using kine as the etcd shim. See the [Architecture](/docs/architecture) page for a deeper look at how the components fit together.
