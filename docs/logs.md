---
title: Log Search
description: Search and view aggregated pod logs in CasOS
keywords: [casos, logs, kubernetes, pod logs, deployment logs]
---

# Log Search

When a Deployment runs multiple replicas, the logs you care about are spread across several pods. Log Search solves this by fetching logs from every pod in a deployment simultaneously and presenting them as a single merged stream. You also get keyword filtering so you can find the error without scrolling through thousands of lines.

## Finding the Log Search page

You can get there two ways. From the sidebar, navigate to **Logs** and use the namespace and deployment selectors to choose what to look at. Or, if you already know which deployment you care about, click **Logs** directly on its row in **Workloads → Deployments** — CasOS jumps to Log Search with the namespace and deployment already selected.

## How aggregation works

CasOS sends a log request to every pod in the deployment in parallel and collects the last N lines from each (default 200). It then merges the results and returns them. Each line is prefixed with the pod name so you can tell which replica produced it — useful when pods are behaving differently and you need to compare their output.

## Keyword filtering

The keyword field filters the merged output on the server side before it reaches the browser. Only lines containing the keyword (case-sensitive) are returned. Use this to find specific errors: type `ERROR`, `panic`, `exception`, or whatever your application logs when something goes wrong. Leaving the keyword field blank returns all lines.

## Increasing tail depth

The **Tail Lines** field controls how many of the most recent lines to fetch from each pod. If an error happened more than 200 lines ago you will miss it with the default setting — raise this to 500 or 1000 if you need deeper history. Be aware that a high tail line count on a busy deployment can be slow, because CasOS fetches that many lines from every replica.

:::tip
For a continuous live stream of logs, use `kubectl logs -f --selector app=<name> --all-containers` from a terminal. Log Search is better for one-shot searches and keyword filtering, not for tailing in real time.
:::
