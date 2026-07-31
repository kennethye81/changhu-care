# iHomeCare — Local Roadshow Demo

Three-end demo sync (Hub / Family / Elite) with P7 alert toggle. No cloud backend required.

## Quick start

```bash
cd ihomecare-latest
npm install
npm run dev
```

This starts:

| Service | URL |
|---------|-----|
| Vite (Hub / Family / Elite) | http://localhost:5174 |
| WebSocket sync relay | ws://localhost:5199 |

## Demo URLs

| Role | URL | Login |
|------|-----|-------|
| **Hub** (Command Center) | http://localhost:5174/ | `admin` / `admin123` |
| **Family** (Chan Tai Ming) | http://localhost:5174/family | Family mock login |
| **Elite** (Care worker) | http://localhost:5174/elites | Elite mock login |

## Recommended setup (cross-browser)

For Chrome + Safari on the same Mac:

1. **Chrome** → Hub `/` → open Patient 7 profile → toggle **⚡ P7 Alert**
2. **Safari** → Family `/family` → Home / Vitals turn red within ~1s
3. **Chrome** (second tab) → Elite `/elites` → work orders + chat update

Same browser (two tabs) also works via `BroadcastChannel`; WS relay covers cross-browser.

## Demo script (~5 min)

1. **Baseline** — Family Home: SpO₂ 93%, stable COPD Day 1 narrative
2. **P7 ON** — Hub toggles alert → Family vitals red, chat switches to RED ALERT thread, Elite dashboard shows escalation
3. **Elite action** — Clock In on P7 task → Hub Patient Profile schedule updates
4. **Family chat** — Send message from Family → appears on Hub Messages / Elite Chat
5. **COPD Protocol** — Family Care tab → **Activate COPD Care Protocol** → log + chat confirmation
6. **P7 OFF** — Hub deactivates → vitals restore, risk scores drop

## Automated smoke test

With `npm run dev` running:

```bash
npm run smoke:demo
```

Checks HTTP routes + WS sync (P7 ON/OFF, chat merge, care log propagation).

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Safari Family not updating | Restart `npm run dev` — ensure sync server on :5199 is up |
| `submittedCareLogs` sync fails | Restart `npm run dev` — stale sync server process |
| Port in use | `lsof -ti :5174 -ti :5199 \| xargs kill -9` then restart |

## Production / public URL

Cloudflare Pages is static-only unless you attach a WebSocket relay.

### What syncs on Pages without extra setup

| Scenario | Sync |
|----------|------|
| Same browser, multiple tabs (Hub + Family + Elite) | Yes — `BroadcastChannel` + `localStorage` |
| Cross-browser (Chrome + Safari) | Needs WebSocket relay |
| Different visitors / devices | Needs WebSocket relay |

### Cloudflare Pages + full three-end sync (recommended)

**Step 1 — Deploy sync Worker**

```bash
npm run deploy:sync-worker
# note the URL, e.g. wss://ihomecare-demo-sync.<account>.workers.dev
```

**Step 2 — Pages build environment variable**

In Cloudflare Pages → Settings → Environment variables:

| Name | Value (example) |
|------|-----------------|
| `VITE_SYNC_WS_URL` | `wss://ihomecare-demo-sync.<account>.workers.dev` |

Or same-origin route (after binding Worker to `/api/demo-sync` on your domain):

| Name | Value |
|------|-------|
| `VITE_SYNC_WS_URL` | `/api/demo-sync` |

If unset, production build defaults to `wss://<your-pages-host>/api/demo-sync`.

**Step 3 — Redeploy Pages**

Build command: `npm run build` · Output: `dist`

**Step 4 — Verify**

1. Chrome → Hub → toggle P7 alert  
2. Safari → `https://<your-site>/family` → vitals turn red within ~1s  

### Same-origin Worker route (optional)

In Cloudflare dashboard, add a Worker route:

- Route: `your-domain.com/api/demo-sync*`
- Worker: `ihomecare-demo-sync`

Then set `VITE_SYNC_WS_URL=/api/demo-sync` on Pages (or rely on the default same-origin path).

MemFire backend integration remains paused; Worker relay is the supported demo path.
