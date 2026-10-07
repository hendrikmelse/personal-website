# Personal Website

A simple portfolio of my projects, at **hendrikmelse.com** and hosted on the same VPS as my other apps. It is frontend-only today, but the layout leaves room to add a backend later. The structure is modeled on [the flashcards app](https://github.com/hendrikmelse/flashcards).

## Stack

- **Language:** TypeScript, in an npm workspaces monorepo (Node 22+)
- **Web:** React + Vite
- **Serving:** the built site in an unprivileged nginx container, behind the server's shared Caddy (HTTPS)
- **CI/CD:** GitHub Actions builds an image, pushes it to GitHub Container Registry, and deploys over SSH

## Repository layout

```
apps/web/             React single-page app (the portfolio)
  src/data/projects.ts    the list of projects shown on the page
deploy/               Production runbook (deploy/README.md) and server-side files
.github/workflows/    CI: typecheck, build, image, deploy
Dockerfile            Builds the web app, serves it with nginx
tsconfig.base.json    Shared TypeScript settings
```

A backend would go in `apps/api/`, and code shared between the two in `packages/shared/`, as in the flashcards repo. Neither exists yet.

## Getting started

Requires Node 22+.

```sh
npm install
npm run dev      # web app on http://localhost:5173
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Web app with reload |
| `npm run typecheck` | Typecheck every workspace |
| `npm test` | Tests in every workspace (none yet) |
| `npm run build` | Typecheck and build the web app into `apps/web/dist` |

## Adding a project

Edit `apps/web/src/data/projects.ts` and add an entry (title, description, tags, optional `url` and `repo`). The page renders it automatically.

## Deployment

Pushes to `master` build and publish an image tagged with the commit SHA; once the server is set up and `DEPLOY_ENABLED` is on, CI deploys it. The server runs it as a Docker Compose project behind the shared Caddy, alongside the flashcards app. See [deploy/README.md](deploy/README.md) for the full runbook (DNS, server setup, CI secrets, rollback).

## Adding a backend later

1. Create `apps/api/` (the workspaces glob `apps/*` already includes it) and, if needed, `packages/shared/` (add it to `workspaces`).
2. Enable the `/api` proxy in `apps/web/vite.config.ts` so development is same-origin.
3. Extend the `Dockerfile` and CI to build the API image, add an `api` service to `deploy/server/portfolio/compose.yaml`, and route `/api/*` to it in the Caddyfile. Details are in the "Adding a backend later" section of `deploy/README.md`.

## Status

- [x] Project framework (monorepo, Vite + React + TS, Dockerfile, CI, deploy files)
- [x] Server setup and deploy loop: DNS, Caddy block, CI secrets; live at https://hendrikmelse.com
- [ ] Real project entries and links in `projects.ts`
- [ ] About/contact section
