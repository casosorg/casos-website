# casos-website

Docusaurus documentation site for [CasOS](https://github.com/casosorg/casos) — a cloud operating system built on Kubernetes. CasOS embeds the full Kubernetes control plane (API server, controller manager, scheduler), so no external cluster is needed. Authentication is via [Casdoor](https://casdoor.org) (OAuth2/OIDC).

Live demo: https://casos.casnode.com

## Package manager

Use **yarn** (not npm). Registry is set to `https://registry.yarnpkg.com` via `.yarnrc`.

```bash
yarn install       # install dependencies
yarn start         # local dev server
yarn build         # production build
yarn serve         # serve production build locally
```

Never run `npm install` or commit `package-lock.json`.
