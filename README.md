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

See `.github/workflows/ci.yml`.

1. Public GitHub repo; default branch `main`.
2. Create a **Free** Render service with **Existing image** (`render.yaml`, `runtime: image`).
3. Repo secret `RENDER_DEPLOY_HOOK`.
4. After the first image push, set the GHCR package to **Public**.
5. Optional: ping `GET /api/health` every 5–10 minutes (UptimeRobot, etc.) so Free instances do not spin down.

Health check: `/api/health`. Render sets `PORT` (default `10000`).

## Env vars

| Variable | Purpose |
| --- | --- |
| `PORT` | Listen port (Render provides this) |
| `STATIC_DIR` | Exported Next.js `out/` (`/app/static` in Docker) |
| `CAL_USERNAME` | Cal.com username (default `lifesshake`) |
| `CONTACT_EMAIL` | Address shown on the site |
| `ALLOWED_ORIGIN` | CORS allowlist for local Next if you call Go on `:10000` from the browser |
| `API_UPSTREAM` | Next dev proxy target (default `http://127.0.0.1:10000`; compose sets `http://backend:10000`) |

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
