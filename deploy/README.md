# Deployment runbook

Runs the site at **https://hendrikmelse.com** (and redirects `www`) on the same
VPS as the flashcards app. It reuses that server's setup: Docker Compose, with
a shared Caddy in front for HTTPS. Keep this file up to date with anything that
changes.

The server, its users, firewall, Docker, and Caddy are set up once, as described
in the flashcards runbook
(<https://github.com/hendrikmelse/flashcards/blob/main/deploy/README.md>). This
file covers only what is specific to the personal website.

## How it fits together

```
internet ─▶ Caddy (80/443, automatic HTTPS) ─▶ portfolio-web (nginx, port 8080)
                                          └──▶ flashcards-api (Node, port 3000)
```

- **One image** contains the built site served by unprivileged nginx. CI builds
  it and pushes it to GitHub Container Registry as
  `ghcr.io/hendrikmelse/personal-website:<commit-sha>`.
- **One compose project** on the server, independent of the others:

  | Path on server | Purpose |
  |---|---|
  | `/srv/portfolio` | This site. `deploy.sh` does pull, restart, health check, rollback. |

- The container joins the shared `web` Docker network so Caddy can reach it by
  name. Its port is never published.

Files in `deploy/server/` mirror what lives on the server and are copied there by
hand; CI does not touch them.

## 1. DNS

At the DNS provider for `hendrikmelse.com` (Namecheap), add:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | the server's IPv4 |
| CNAME Record | `www` | `hendrikmelse.com.` |

Leave the `flashcards` record alone. Caddy can only get a certificate once these
resolve to the server.

## 2. Set up the app directory

On the server, as the admin user:

```bash
sudo mkdir -p /srv/portfolio && sudo chown deploy:deploy /srv/portfolio
# from your machine:
scp deploy/server/portfolio/{compose.yaml,deploy.sh,ci-entrypoint.sh} deploy@<ip>:/srv/portfolio/
ssh deploy@<ip> 'chmod +x /srv/portfolio/*.sh'
```

(Use the same user and ownership scheme as `/srv/flashcards`.)

## 3. Add the site to Caddy

Add the blocks from `deploy/server/caddy/Caddyfile.snippet` to
`/srv/caddy/Caddyfile`, then reload:

```bash
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

(Use the container name and config path from the flashcards setup.)

## 4. First deploy

CI builds the image on every push to `master`. For the first deploy, run by hand
with a commit that CI has already pushed:

```bash
/srv/portfolio/deploy.sh ghcr.io/hendrikmelse/personal-website:<40-char-commit-sha>
```

The package may need to be made accessible to the server (`docker login ghcr.io`
with a token that can read packages) the first time.

## 5. Automatic deploys from CI

1. Create a key: `ssh-keygen -t ed25519 -f portfolio-deploy -C github-actions-portfolio`.
2. On the server, add the public key to the deploy user's
   `~/.ssh/authorized_keys` as a forced command, so it can run nothing else:

   ```
   restrict,command="/srv/portfolio/ci-entrypoint.sh" ssh-ed25519 AAAA... github-actions-portfolio
   ```

3. In the GitHub repo settings, create an environment named `production` and add
   the secrets `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY` (the private key),
   and `DEPLOY_KNOWN_HOSTS` (output of `ssh-keyscan <host>`).
4. Set the repository variable `DEPLOY_ENABLED` to `true`.

Pushes to `master` then test, build, push the image, and deploy it.

## Rolling back

Run `deploy.sh` with the previous image tag. `/srv/portfolio/current-image` holds
the one currently deployed. `deploy.sh` also rolls back by itself if the new
version never becomes healthy.

## Logs

Container logs go to the host journal and survive deploys:

```bash
sudo journalctl -t portfolio-web
```

## Adding a backend later

1. Add `apps/api` (see the README's "Adding a backend later").
2. Add an `api` service to `deploy/server/portfolio/compose.yaml` (image built by
   CI, `container_name: portfolio-api`, on the `web` network; also on `db` if it
   needs Postgres, with its own database and role in the shared Postgres).
3. Switch the Caddy block to the `handle /api/*` form shown in the snippet.
4. Extend `deploy.sh` to migrate and health-check the API, as the flashcards
   `deploy.sh` does.
