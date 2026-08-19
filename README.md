# Yash Gupta — profile site

Dark personal site: **Go** API + **Next.js** UI. Production is a single container image built in GitHub Actions, pushed to GHCR, and **pulled** by a Free Render web service (Render does not run `docker build`).

## What’s in here

| Area | Notes |
| --- | --- |
| Home | Hero, about, skills, experience, education, GitHub CTA, **inline calendar**, contact |
| Projects | Not a gallery — nav **Projects** goes to [github.com/yashgupta9696](https://github.com/yashgupta9696) |
| Schedule | Calendar is embedded on the home page (`/#schedule`) via Cal.com’s inline embed |
| Socials | GitHub, LinkedIn, Twitter (`yash_dscale`). YouTube marked in progress |

Content is from the resume plus current LinkedIn roles (Apple, Kong). Apple/Kong bullets are thin until you add real ones.

Follow-ups (domain, email, Cal.com, monitoring, CI secrets): [TODO.md](./TODO.md).

## Local development (auto-reload)

Use **two processes**. Open [http://127.0.0.1:3000](http://127.0.0.1:3000) — that is the app you edit. Next proxies `/api/*` to Go on port `10000`.

### Frontend (Next.js Fast Refresh)

`npm run dev` already hot-reloads React/CSS. Most component edits apply without a full refresh.

```bash
cd frontend
npm install
npm run dev
```

Restart this process if you change `next.config.js`, `tailwind.config.js`, or env vars.

### Backend

```bash
cd backend
go run ./cmd/server
```

Restart this process after Go or `internal/content/profile.json` changes. Optional: `export ALLOWED_ORIGIN=http://127.0.0.1:3000` if you call the API on `:10000` from the browser directly.

### What reloads where

| You change | Reloads |
| --- | --- |
| `frontend/components/**`, `app/**`, `globals.css` | Next Fast Refresh |
| `frontend/data/profile.json` | Next (fallback copy; refresh the tab if it does not pick up) |
| `backend/**/*.go`, `backend/internal/content/profile.json` | Restart `go run ./cmd/server` |
| `Dockerfile`, `render.yaml`, GitHub workflow | Not used in local dev |
| `docker-compose.dev.yml`, `**/Dockerfile.dev` | Use Docker dev stack below |

API-only check: [http://127.0.0.1:10000/api/health](http://127.0.0.1:10000/api/health). If `STATIC_DIR` is unset or missing, Go still serves `/api/*`.

## Docker Compose (dev — hot reload)

Full stack in containers with file sync and live reload. Open [http://localhost:3000](http://localhost:3000).

```bash
docker compose -f docker-compose.dev.yml up --build
```

| Service | Reload | Notes |
| --- | --- | --- |
| `frontend` | Next Fast Refresh | Mounts `./frontend`; `WATCHPACK_POLLING` for Docker Desktop / WSL |
| `backend` | Manual | `go run` in container — `docker compose -f docker-compose.dev.yml restart backend` after Go changes |

`API_UPSTREAM=http://backend:10000` is set in compose so Next proxies `/api/*` to the backend container (native dev still uses `127.0.0.1:10000`).

API direct: [http://localhost:10000/api/health](http://localhost:10000/api/health).

Stop: `docker compose -f docker-compose.dev.yml down`. To reset deps: add `-v` to drop `frontend_node_modules`.

## Docker Compose (production image)

```bash
docker compose up --build
# http://localhost:10000
```

Single container from the root `Dockerfile` — no hot reload.

## Production (GitHub → GHCR → Render)

See `.github/workflows/ci.yml` and `render.yaml`.

GitHub Actions **does not** create the Render service and **does not** apply `render.yaml`. CI tests, builds the Docker image, pushes it to GHCR, then calls a **deploy hook** on a service that already exists. `render.yaml` is a [Render Blueprint](https://render.com/docs/blueprint-spec): Render reads it only when **you** apply it in the dashboard.

| Piece | Role |
|---|---|
| **GitHub Actions** | Test → `docker build` → push `ghcr.io/<owner>/<repo>` → `curl` **`RENDER_DEPLOY_HOOK`** with `imgURL=<digest>` |
| **`render.yaml`** | Recipe: `runtime: image`, Free plan, image URL, health check, non-secret env vars |
| **Deploy hook** | Tells that **existing** service to pull a new image. It does not provision anything |

Render **pulls** the image. It does **not** run `docker build`, so Hobby **pipeline minutes** stay almost unused. Builds use GitHub Actions minutes instead.

### One-time setup

1. Public GitHub repo; default branch `main`. Fork or copy this project, then change `render.yaml` `image.url` to `ghcr.io/<your-github-owner>/<your-repo>:latest` (lowercase).
2. Create the Render service **once** (Blueprint or manual — below). The first image pull can fail until CI has published to GHCR; that is expected.
3. After the first successful image push: GitHub → **Packages** → this image → **Package settings** → visibility **Public**, so Render can pull without registry credentials.
4. Render service → **Settings** → copy **Deploy Hook**.
5. GitHub repo → **Settings → Secrets and variables → Actions** → `RENDER_DEPLOY_HOOK`.
6. Add secrets on the **service** (not in git): Render → **`self-profile`** → **Environment** → **Environment Variables** → **+ Add**. At least `RESEND_API_KEY` for contact mail (HTTPS API). Do **not** use **Secret Files** for this — the app reads env vars, not `/etc/secrets/`.
7. Save with **Save and deploy** so the running process picks up new env. **Save only** waits until the next deploy.
8. Optional: ping `GET /api/health` every 5–10 minutes (UptimeRobot, cron-job.org) so Free instances do not spin down after 15 minutes idle.

After this, every push to `main` (except markdown-only) rebuilds/pushes the image and hits the hook. You do not recreate the service.

Health check: `/api/health`. Render sets `PORT`.

### Create the service: Blueprint (recommended)

Uses `render.yaml` as-is.

1. [dashboard.render.com](https://dashboard.render.com/) → **New** → **Blueprint**.
2. Connect this GitHub repo. Render creates **`self-profile`** (`plan: free`, `runtime: image`, `healthCheckPath: /api/health`, `autoDeployTrigger: off`).
3. Non-secret env from the blueprint (`CAL_*`, `CONTACT_EMAIL`, `STATIC_DIR`) is applied. Add `RESEND_API_KEY` in the dashboard (step 6 above). If you later re-apply the blueprint, keep dashboard secrets; do not put API keys in `render.yaml` as `value:`.

### Create the service: manual

Same result without Blueprint:

1. **New** → **Web Service** → **Deploy an existing image** (not “build from Dockerfile”).
2. Image: `ghcr.io/<owner>/<repo>:latest`.
3. Instance: **Free**, one instance. Health check `/api/health`.
4. Set the env vars in the table below (plus `RESEND_API_KEY`).
5. Then deploy hook + GitHub secret, same as steps 4–6 above.

### Email on Render (contact form)

Free web services **block outbound SMTP** (ports **25, 465, 587**). There is no Render mailbox. Paid instances can use 465/587; port 25 stays blocked. Gmail SMTP from cloud IPs is unreliable anyway.

Use an **HTTPS** provider (port 443), e.g. [Resend](https://resend.com). Put **`RESEND_API_KEY`** only in Render **Environment**. Verify a **from** address with the provider (`MAIL_FROM` when wired). `CONTACT_EMAIL` is the inbox that receives form submissions.

Until the API key is set, `POST /api/contact` still validates; delivery depends on the mail sink being configured.

### Cal.com

Set `CAL_USERNAME` and `CAL_EVENT_SLUG` to your Cal.com user and event type. The site embeds `https://cal.com/<username>/<event>`. If **your** name and email appear on the booking form while testing, you are logged into Cal.com in that browser — visitors see empty fields.

## Env vars

| Variable | Where | Purpose |
|---|---|---|
| `PORT` | Render (automatic) | Listen port |
| `STATIC_DIR` | `render.yaml` | Exported Next.js `out/` (`/app/static` in Docker) |
| `CAL_USERNAME` | `render.yaml` / Docker | Cal.com username |
| `CAL_EVENT_SLUG` | `render.yaml` / Docker | Event type slug |
| `CONTACT_EMAIL` | `render.yaml` / Docker | Address shown on the site and mail destination |
| `RESEND_API_KEY` | Render dashboard only | Contact mail over HTTPS. Never commit |
| `MAIL_FROM` | Render dashboard (when used) | Verified sender at the mail provider |
| `ALLOWED_ORIGIN` | Local only | CORS if the browser calls Go on `:10000` |
| `API_UPSTREAM` | Next **dev** only | Proxy target (default `http://127.0.0.1:10000`; compose `http://backend:10000`) |

## Layout

```
backend/cmd/server            process entry
backend/internal/config
backend/internal/api           HTTP handlers (gorilla/mux)
backend/internal/contact       contact validation + delivery sink
backend/internal/content       profile.json
backend/internal/server        mux wiring
backend/pkg/httpx             JSON, IP, CORS
backend/pkg/ratelimit
backend/pkg/webstatic         Next.js export files (production)
frontend/                 Next.js 14 (dev server + static export)
frontend/Dockerfile.dev   Next dev container
backend/Dockerfile.dev    Go dev container (`go run`)
docker-compose.dev.yml    hot-reload stack (ports 3000 + 10000)
docker-compose.yml        production image locally
.github/workflows/ci.yml  test, GHCR push, Render deploy hook
```
