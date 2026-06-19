---
title: Trivy Image Scanning
description: Scan container images for vulnerabilities using Trivy in CasOS
keywords: [casos, trivy, security, vulnerability scanning, container images]
---

# Trivy Image Scanning

Before you deploy a container image, it is worth checking whether it carries known security vulnerabilities. CasOS integrates [Trivy](https://trivy.dev/), an open-source vulnerability scanner, so you can scan any image directly from the web UI without setting up a separate pipeline.

## Prerequisites

Trivy must be installed on the machine running CasOS and available on its `PATH`. Without Trivy, the scan endpoint returns an error.

```bash
# Linux — install to /usr/local/bin
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Verify
trivy --version
```

On the first scan, Trivy downloads its vulnerability database from GitHub. This can take a minute. Subsequent scans use the cached database and are much faster.

## Running a scan

Open **Security → Trivy Scan**. Enter the image reference in the input field — for example `nginx:1.27` or `myrepo/myapp:v1.2.3` — and click **Scan**. The scan runs synchronously and results appear when it completes. Scanning a large image with a cold cache may take 30–60 seconds; a warm cache is typically under 10 seconds.

## Reading the results

Trivy classifies every finding by severity: `CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, and `UNKNOWN`. For each vulnerability it reports the affected package name, the installed version, the version in which the vulnerability was fixed (if one exists), and the CVE identifier you can look up in the [National Vulnerability Database](https://nvd.nist.gov/).

In practice, `CRITICAL` findings should be addressed immediately — they represent actively exploited or trivially exploitable vulnerabilities. `HIGH` findings are also worth addressing before deploying to production. `MEDIUM` and `LOW` findings are worth tracking but usually do not block a release on their own.

## Scan history

CasOS saves every scan result in the database. The history table lists all past scans with the image name and finding counts, so you can compare scan results over time or check the security posture of images you deployed weeks ago. Click **Delete** to remove a result from the history when it is no longer needed.
