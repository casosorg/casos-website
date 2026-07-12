---
title: Worker Node Deployment
description: Turn a registered machine into a Kubernetes worker node over SSH, straight from the CasOS UI
keywords: [casos, worker node, deployment, ssh, kubelet, containerd, kubernetes, node]
---

# Worker Node Deployment

CasOS runs the control plane — API server, scheduler, and controller manager — inside its own process, but workloads still need a machine with a running kubelet to execute on. CasOS can take a [registered machine](/docs/infrastructure/machines) and turn it into a worker node for you: it connects over SSH, installs the container runtime and kubelet, writes the join configuration, and starts the services, all without you touching the target host directly.

Deployment is driven from **Infrastructure → Machines**. Open a machine and choose **Worker Node** to open the deployment drawer.

## SSH prerequisites on the target machine

Before CasOS can deploy a node, the target host must accept SSH login with the credentials you stored on its [machine record](/docs/infrastructure/machines). CasOS logs in, runs preflight checks, and then installs software with elevated privileges, so the login user needs `sudo` (or must be `root`).

The steps below prepare a fresh Ubuntu host — including one running under WSL, a common local-testing setup — to accept password-based root login.

1. **Install the SSH server**

   ```bash
   sudo apt update && sudo apt install -y openssh-server
   ```

2. **Start the SSH service**

   ```bash
   sudo service ssh start
   ```

3. **Set the root password**

   ```bash
   sudo passwd root
   ```

4. **Enable root login and password authentication**

   ```bash
   sudo sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
   sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication yes/' /etc/ssh/sshd_config
   sudo service ssh restart
   ```

5. **Verify connectivity** from another machine before deploying:

   ```bash
   ssh root@<machine-ip> -p 22
   ```

   You should be prompted for the root password and log in successfully.

:::note
Password-based root login is convenient for local and lab environments. In production, prefer a dedicated user with `sudo` and **Private key** authentication on the machine record.
:::

When you add the machine in CasOS, match the fields to the SSH setup above:

| Field | Value |
|-------|-------|
| **IP** | The host's reachable address (for WSL, the WSL host IP, e.g. `172.22.149.109`) |
| **Port** | `22` |
| **Username** | `root` |
| **Auth type** | `Password` (or `Private key`) |
| **Password** / **Private key** | The credential you configured above |

## Preflight

Click **Preflight** first. CasOS opens an SSH session and inspects the target so a deployment does not fail halfway through. The result reports:

| Check | What it confirms |
|-------|------------------|
| **OS** | The host runs Linux (the only supported node OS). |
| **Arch** | The CPU architecture, so the correct kubelet/containerd binaries are fetched. |
| **systemd** | Whether systemd is available to manage the node services. |
| **Package** | The detected package manager (`apt`). |
| **sudo** | Whether the login user can elevate privileges. |
| **WSL** | Whether the host is running under WSL, which needs some setup adjustments. |

CasOS also validates the **Apiserver URL** the node will join. If you leave it blank, CasOS resolves a reachable `https://<casos-host>:<apiserverPort>` address automatically and confirms the API server responds. A failing preflight is reported with the specific problem so you can fix it before deploying.

## Deploying

Set a **Node name** (it defaults to the machine name and must be a valid RFC 1123 subdomain) and, optionally, an **Apiserver URL**, then click **Deploy Node**. CasOS runs the deployment as a background task and streams its progress and logs into the drawer.

A deployment moves through these phases:

| Phase | What happens |
|-------|--------------|
| **queued** | The task is created and waiting to start. |
| **preflight** | Preflight checks run again to confirm the host is still ready. |
| **installing** | The container runtime (containerd), kubelet, and CNI plugins are installed. |
| **configuring** | Kubelet, kube-proxy, and the join kubeconfig are written, using certificates issued by the CasOS control plane. |
| **starting** | The node services are started (under systemd where available). |
| **waiting** | CasOS waits for the kubelet to register and report in. |
| **ready** | The node has joined and reached `Ready`; it now appears on the [Nodes](/docs/nodes) page. |

If any phase fails, the task moves to **failed** and the error is shown alongside the logs. Only one deployment task can be active for a machine at a time.

## Repairing a node

If a previously deployed node stops working — for example the kubelet is not running after a host reboot, or its join configuration drifted — open the machine and click **Repair Node**. Repair reruns the configuring and starting steps against the existing node rather than installing everything from scratch, and streams its logs the same way a deployment does.

## Deployment history and logs

The drawer lists every deployment and repair task for the machine with its status (`pending`, `running`, `succeeded`, `failed`). Select a task to view its full log output. The list refreshes automatically while a task is running, so you can watch a deployment progress in real time. Deployment logs are the first place to look when a node fails to reach `Ready`.

## Related

- [Machines](/docs/infrastructure/machines) — register and manage the hosts CasOS deploys to.
- [Nodes](/docs/nodes) — view node health and capacity once a machine has joined the cluster.
