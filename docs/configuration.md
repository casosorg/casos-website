---
title: Configuration
description: Full reference for CasOS conf/app.conf settings
keywords: [casos, configuration, app.conf]
---

# Configuration

CasOS reads a single config file at startup: `conf/app.conf`. Below is an annotated example covering every option.

```ini
appname       = casos
httpport      = 9000
runmode       = dev
SessionOn     = true
copyrequestbody = true

; -- Database ---------------------------------------------------------------
driverName    = mysql
dataSourceName= root:123456@tcp(localhost:3306)/
dbName        = casos

; -- Casdoor ----------------------------------------------------------------
casdoorEndpoint     = https://door.casdoor.com
clientId            = <your-client-id>
clientSecret        = <your-client-secret>
casdoorOrganization = <your-org>
casdoorApplication  = <your-app>

; -- Outbound proxy (optional) ----------------------------------------------
socks5Proxy   = 127.0.0.1:10808

; -- Control plane ----------------------------------------------------------
apiserverPort = 6443
apiserverBind = 127.0.0.1
dataDir       = /var/lib/casos
```

## Beego settings

`httpport` controls which port the web UI and REST API listen on (default `9000`). Set `runmode` to `prod` in production to suppress debug output. The `SessionOn` and `copyrequestbody` options should stay `true` — they are required for session handling and request body parsing.

## Database

`dataSourceName` is a MySQL DSN in the format `user:pass@tcp(host:port)/` — without a database name at the end. CasOS appends the value of `dbName` (default `casos`) automatically. The same MySQL database stores both application data and all Kubernetes state (via kine), so you only need one database instance.

:::info
Create the database before first run:
```sql
CREATE DATABASE IF NOT EXISTS casos CHARACTER SET utf8mb4;
```
:::

## Casdoor

`casdoorEndpoint` is the URL of your Casdoor instance. `clientId` and `clientSecret` come from the Casdoor application you created. `casdoorOrganization` and `casdoorApplication` must match exactly what you set in Casdoor. See [Authentication](/docs/authentication) for the full setup walkthrough.

## Control plane

`apiserverPort` sets the HTTPS port for the embedded Kubernetes API server (default `6443`). `apiserverBind` is the IP the API server binds to and advertises — use `127.0.0.1` for local development and your machine's outbound IP for a multi-node setup. `dataDir` is where CasOS writes TLS certificates and other persistent control-plane data; make sure this directory is writable and survives reboots.

`webhookPort` (default `9443`) is the HTTPS port for the internal Casbin admission and authorization webhook servers. It does not need to be exposed outside the machine.

## Optional: outbound proxy

If your environment requires a SOCKS5 proxy to reach container registries or the Kubernetes pause image, set `socks5Proxy` to `host:port`. When this is set, CasOS automatically switches the default sandbox (pause) image to `registry.aliyuncs.com/google_containers/pause:3.10.1` instead of the upstream `registry.k8s.io` image. You can override this further with `sandboxImage`.
