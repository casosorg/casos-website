---
title: Authentication
description: Configure Casdoor authentication for CasOS
keywords: [casos, authentication, casdoor, oauth2, oidc, sso]
---

# Authentication

CasOS does not manage user accounts itself. All authentication is delegated to [Casdoor](https://casdoor.org), an open-source Identity Access Management platform. When a user tries to open CasOS, they are redirected to Casdoor to log in. Casdoor issues an OAuth2 authorization code, CasOS exchanges it for an access token, and the session is established. From that point on, CasOS validates the token on every API request.

This design means you can use any identity provider that Casdoor supports — including Google, GitHub, LDAP, SAML, Active Directory, and more — without changing anything in CasOS itself.

## Setting up Casdoor

You need a running Casdoor instance and an Application configured in it. For testing, you can use the public demo at `https://door.casdoor.com`. For production, [self-host Casdoor](https://casdoor.org/docs/get-started).

In the Casdoor admin UI, open your Organization (or create one) and then go to **Applications → Add**. Set the Organization field and add a Redirect URL pointing at your CasOS callback endpoint:

```
http://<casos-host>:<httpport>/callback
```

For example: `http://localhost:9000/callback`. After saving, copy the **Client ID** and **Client Secret** from the application page.

## Configuring CasOS

Add the Casdoor connection details to `conf/app.conf`:

```ini
casdoorEndpoint     = https://door.casdoor.com
clientId            = af6b5aa958822fb9dc33
clientSecret        = <your-client-secret>
casdoorOrganization = casbin
casdoorApplication  = app-casibase
```

All four values must match exactly what you configured in Casdoor. After editing `app.conf`, restart CasOS. The next time a user opens CasOS, they will be redirected to your Casdoor instance's login page.

## Quick start with the demo instance

The default `conf/app.conf` in the repository is pre-configured to use `https://door.casdoor.com`. You can log in immediately with the demo credentials:

- **Organization / username**: `casbin` / `admin`
- **Password**: `123`

:::caution
The public demo instance is shared and reset periodically. Never use it for anything beyond local testing.
:::

## Language support

CasOS reads the user's browser `Accept-Language` header and serves the UI in English or Chinese accordingly. Users can also switch language manually from the top navigation bar. The language preference is stored per session.
