---
title: App Store
description: Deploy and manage applications from the CasOS App Store
keywords: [casos, app store, sites, applications, deploy]
---

# App Store

The App Store is a catalog of pre-configured application templates. Instead of filling in a full Deployment form from scratch, you pick an app from the catalog, review the defaults, and deploy it with a few clicks.

## Deploying an application

Open **App Store** and click on any application card. A deploy dialog opens with pre-filled defaults — the container image, port, and replica count are already set based on the template. You can change the namespace, name, and any other field before clicking **Deploy**. CasOS creates the Deployment (and a Service if the template specifies a port) in the chosen namespace.

The deployed application then appears in **Workloads → Deployments** alongside anything you created manually. There is no distinction once deployed — you manage it the same way as any other deployment.

## DockerHub browser

When creating or updating a Deployment, you can browse DockerHub directly from the image selector. Search for a public image by name, choose a tag from the list, and CasOS fills the image field automatically. This avoids typos in image references and makes it easy to find the right tag without leaving the browser.

## Managing application templates (Sites)

Platform administrators can add custom templates to the catalog. Navigate to **App Store → Add Site** and fill in a display name, description, icon URL, default image, default port, and a category for grouping. Once saved, the template appears in the catalog for all users.

Templates are stored as Site objects in the CasOS database. They define defaults only — users can change any field when deploying, so a template does not restrict what gets deployed, it just makes the common case faster.
