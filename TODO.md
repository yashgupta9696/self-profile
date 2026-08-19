# TODOs

Follow-ups from the profile-site setup. Check these off as they land.

## Domain and email

- [x] Buy the domain on Hostinger, point DNS at Render, and add it as a custom domain. The `*.onrender.com` URL stays.
- [ ] Replace `CONTACT_EMAIL` / site email (`lifesshake@gmail.com`) with a `support@` mailbox on that domain.
  - Env: `CONTACT_EMAIL` in `render.yaml` / Docker.
  - Also update `backend/internal/content/profile.json` and `frontend/data/profile.json`.
- [x] Wire `POST /api/contact` through Resend (`RESEND_API_KEY`, `MAIL_FROM`, `CONTACT_EMAIL`). Until a domain is verified, Resend only allows `From: onboarding@resend.dev` to the account owner.

## Calendar

- [x] Cal.com event type: `profile-connect-meeting` — inline booker via `@calcom/embed-react` (`lifesshake/profile-connect-meeting`).

## Social and writing

- [ ] Add YouTube URL when the channel is ready (`socials.youtube` is `null`; footer says “in progress”).
- [ ] Optional: WordPress blog links and a Writing section (originally requested; left out when we limited socials to GitHub, LinkedIn, Twitter).

## Content

- [ ] Expand Apple (Oct 2025–present) bullets — resume did not include this role.
- [ ] Expand Kong (Jul–Oct 2025) bullets — same.
- [ ] Confirm Bloomreach end date (resume said Present; LinkedIn said Jul 2025).

## Deploy

- [ ] Push the repo and create **one** Render **image** web service from `render.yaml` (`plan: free`, health check `/api/health`).
- [ ] Confirm Docker Desktop / `docker compose up --build` locally if you want a single-container preview.

## CI / auto-deploy

GitHub Actions tests on PRs/pushes, then on `main` builds the Docker image, pushes to GHCR, and tells Render to pull that digest ([deploy hook + `imgURL`](https://render.com/docs/deploy-hooks)). Render does **not** build the Dockerfile, so Hobby **pipeline minutes stay almost unused**. The Docker build uses **GitHub Actions minutes** instead.

- [x] Add `.github/workflows/ci.yml`.
- [ ] Add GitHub secret `RENDER_DEPLOY_HOOK`.
- [ ] After the first image push, set the GHCR package visibility to **Public** (GitHub → Packages → package settings) so Render can pull without credentials.
- [ ] Dashboard: pipeline spend limit **$0**. No PR previews, no extra Render services.
- [ ] Keep the default branch as `main` (workflow only publishes from `main`).

### Keep-alive (optional)

Render Free spins down after **15 minutes** with no HTTP traffic. UptimeRobot is set up **manually** on the custom domain (`GET /api/health` every 5 minutes). Not GitHub Actions.

- [x] HTTP monitor on the custom domain `/api/health` in UptimeRobot.
- [ ] One always-on Free service uses ~744 of **750** instance hours in a 31-day month — do not add a second Free web service.

## Monitoring

Keep-alive pings only prove the process is up. Add real monitoring so you notice outages, slow deploys, and errors.

- [ ] Uptime + alerts: HTTP check on `/api/health` and the homepage, with email/Telegram/Slack when it fails (UptimeRobot, Better Stack, or cron-job.org + notification). Distinct from “just ping to stay warm.”
- [ ] Watch Render: dashboard metrics, deploy history, and Hobby **instance hours / bandwidth** so a keep-alive loop does not silently burn the 750-hour cap.
- [ ] Optional error tracking (e.g. Sentry) for Go 5xx and frontend exceptions — only if it stays on a free plan and does not add another Render service.
- [ ] Optional privacy-friendly analytics (Plausible / Umami / Cloudflare Web Analytics) after the custom domain is live. Skip heavy trackers.


Image destination in CI: `ghcr.io/<github-owner>/<repo>` (`latest` + commit SHA; deploy uses the digest). Example: `ghcr.io/yashgupta9696/self-profile:latest`.

### Caps (Hobby workspace, one Free web service)

| Limit | Cap we will respect | Why |
| --- | --- | --- |
| Instance type | `free`, **1** instance | Paid types and scaling are out of free. |
| Free instance hours | **750 / month** workspace-wide | Idle spin-down (15 min) does **not** consume hours. |
| Render build pipeline | **500 minutes / month** — avoid using them | Image pull is not a Dockerfile build. Do not switch back to `runtime: docker`. |
| GitHub Actions | **1 concurrent job**, `cancel-in-progress`, ignore `*.md` | Docker build happens here. Private repos have a monthly Actions cap. |
| Outbound bandwidth | **5 GB / month** (current Hobby) | No extra services, no large assets. |
| Custom domains | **2 included** | One apex + `www`. |
| Datastores | **none** | Free Postgres expires in 30 days and we do not need a DB. |

### Out of scope on free tier

No persistent disk, no SMTP from the Render box (ports 25/465/587 blocked), no horizontal scale, no always-on (cold start ~1 min after idle).

