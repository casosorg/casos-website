---
title: Get Started
description: Get CasOS running for the first time
keywords: [casos, install, quickstart, get started]
---

# Get Started

This guide walks you through running CasOS on a single machine from source. You will need Go 1.26+, Node.js 20+, Yarn 1.x, and a running MySQL instance.

## 1. Clone the repository

```bash
git clone https://github.com/casosorg/casos.git
cd casos
```

## 2. Create the database

CasOS uses a single MySQL database for both application data and Kubernetes state. Create it before first run:

```sql
CREATE DATABASE IF NOT EXISTS casos CHARACTER SET utf8mb4;
```

## 3. Configure

Edit `conf/app.conf` with your database connection and Casdoor credentials:

```ini
; Database
driverName    = mysql
dataSourceName= root:yourpassword@tcp(localhost:3306)/
dbName        = casos

; Casdoor — use the public demo for local testing
casdoorEndpoint     = https://door.casdoor.com
clientId            = af6b5aa958822fb9dc33
clientSecret        = 8bc3010c1c951c8d876b1f311a901ff8deeb93bc
casdoorOrganization = casbin
casdoorApplication  = app-casibase
```

The `dataSourceName` ends with a `/` and no database name — CasOS appends `dbName` automatically. The Casdoor credentials above point to the public demo instance, which is fine for local testing. See [Authentication](/docs/authentication) to connect your own Casdoor instance.

## 4. Start the backend

```bash
go run main.go
```

On first start, CasOS generates TLS certificates in `/var/lib/casos/tls/`, starts kine, waits for the embedded Kubernetes API server to become healthy, and then starts the Beego HTTP server on port `9000`. The first start takes longer because of certificate generation and API server bootstrap — subsequent starts are faster.

## 5. Start the frontend

In a separate terminal:

```bash
cd web
yarn install
yarn start
```

The dev server starts on port `8001` and proxies API calls to `localhost:9000`. Open [http://localhost:8001](http://localhost:8001) in your browser.

## 6. Log in

You will be redirected to the Casdoor login page. Using the public demo credentials:

- **Username**: `admin`
- **Password**: `123`

After logging in you land on the [Dashboard](/docs/dashboard), which shows a cluster overview. The Kubernetes API server is embedded and running, but you will not have any worker nodes yet. See [Nodes](/docs/nodes) for how to join a worker node to the cluster.

## Production build

To run CasOS without a Node.js dev server, build the frontend and let the Go backend serve the static files:

```bash
# Build the frontend
cd web
yarn build
cd ..

# Build and run the backend
go build -o casos .
./casos
```

The UI is then served at `http://localhost:9000` directly from the Go binary.

:::info
For production deployments, change `runmode = dev` to `runmode = prod` in `conf/app.conf`. Also set `apiserverBind` to your machine's non-loopback IP if you want worker nodes on other machines to be able to join.
:::
