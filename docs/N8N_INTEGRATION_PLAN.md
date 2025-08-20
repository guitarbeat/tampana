### Tampana × n8n integration plan

This plan connects the Tampana frontend to your self‑hosted n8n at `https://n8n.alw.lol` using webhooks and optional pull endpoints.

### Goals
- Sync event changes (create/update/delete) from Tampana to n8n in near‑real time
- Push full data exports and summaries to n8n on demand
- Optional: import events from n8n into Tampana

### Assumptions & prerequisites
- n8n is reachable at `https://n8n.alw.lol`
- CORS allowed for the app’s origin (see Security section)
- If auth is required, we’ll use either a webhook secret, Basic Auth, or a Bearer token via custom header

### Architecture overview
- Frontend → n8n via HTTPS:
  - POST webhook for event mutations
  - POST webhook for full export JSON
  - POST webhook for emotion summary JSON
  - Optional GET webhook (or HTTP Request node) for pulling events
- Robust client in the frontend with retry + localStorage queue when offline

### Data contracts
- Event (as used in the app):
```json
{
  "id": "string",
  "title": "string",
  "start": "2025-01-20T14:30:00.000Z",
  "end": "2025-01-20T15:30:00.000Z",
  "emotion": "happy|sad|angry|calm|excited|anxious|neutral|grateful",
  "emoji": "😊",
  "class": "emotional-event happy",
  "background": false,
  "allDay": false
}
```

- Event mutation payload:
```json
{
  "type": "created|updated|deleted",
  "occurredAt": "2025-01-20T14:31:22.123Z",
  "source": "tampana",
  "event": { /* Event (above) */ }
}
```

- Full export payload (matches existing export):
```json
{
  "exportDate": "2025-01-20T14:31:22.123Z",
  "totalEvents": 42,
  "events": [ { /* Event */ } ]
}
```

- Emotion summary payload (matches existing summary):
```json
{
  "exportDate": "2025-01-20T14:31:22.123Z",
  "totalEvents": 42,
  "emotionBreakdown": [
    { "emotion": "happy", "count": 10, "percentage": 24 }
  ],
  "mostCommonEmotion": "happy",
  "dateRange": { "earliest": "…", "latest": "…" }
}
```

### n8n endpoints to create
- POST /webhook/tampana/event-change
  - Receives event mutation payload; branch by `type` to store/log/notify
- POST /webhook/tampana/export
  - Receives full export JSON
- POST /webhook/tampana/summary
  - Receives summary JSON
- Optional GET /webhook/tampana/pull
  - Returns `{"events": [Event,…]}` for import/sync

Suggested starter nodes per workflow:
- Webhook → IF (auth/secret) → Switch (by `type`) → (Postgres/SQLite/Google Sheets/Notion) → (Slack/Email)

### Frontend changes (Tampana)
1) Settings UI additions (in `SettingsPage`)
- Enable n8n integration (toggle)
- Base URL (default `https://n8n.alw.lol`)
- Paths: event change, export, summary, optional pull
- Auth options:
  - Header name + token (e.g., `X-API-Key`)
  - Or Basic username/password
  - Secret query param if preferred by webhook
- Persist these in `localStorage` under `tampanaN8N`

2) n8n client module (`src/services/n8nClient.ts`)
- Config read/write helpers (load from `localStorage` and from `VITE_N8N_*` env fallbacks)
- `postEventChange(event, type)` → POST JSON, retry with exponential backoff
- `postExport(exportJson)` and `postSummary(summaryJson)`
- Offline queue: enqueue payloads in `localStorage` and flush on reconnect

3) Wire event hooks
- In `EmotionalCalendar`:
  - After create/update: call `postEventChange(event, 'created'|'updated')`
  - After delete: call `postEventChange({id}, 'deleted')`

4) DataExport integrations
- Add two menu items:
  - “Send JSON to n8n” → `postExport(exportJson)`
  - “Send Summary to n8n” → `postSummary(summaryJson)`
- Keep existing downloads/clipboard behavior

5) Optional import flow
- Add “Import from n8n” button that GETs from `/pull` endpoint and merges into local events (dedupe by `id`)

### Env vars and configuration
- `.env` (dev/testing):
  - `VITE_N8N_BASE_URL=https://n8n.alw.lol`
  - `VITE_N8N_EVENT_PATH=/webhook/tampana/event-change`
  - `VITE_N8N_EXPORT_PATH=/webhook/tampana/export`
  - `VITE_N8N_SUMMARY_PATH=/webhook/tampana/summary`
  - Optional: `VITE_N8N_AUTH_HEADER=X-API-Key` and `VITE_N8N_AUTH_TOKEN=…`

### Security, CORS, and networking
- n8n must allow the app origin via env var `N8N_SECURITY_ALLOW_ORIGIN` (comma‑separated list)
- Prefer HTTPS; if using a self‑signed cert, browsers may block requests
- Use webhook secrets or tokens; do not hardcode secrets in the repo
- Apply rate limiting and input validation in n8n

### Step‑by‑step tasks (checklist)
- [ ] Create `src/services/n8nClient.ts` with config, POST helpers, retries, and queue
- [ ] Add n8n settings section in `SettingsPage` and persist to `localStorage`
- [ ] Hook `EmotionalCalendar` save/delete to `n8nClient.postEventChange`
- [ ] Extend `DataExport` menu with “Send JSON to n8n” and “Send Summary to n8n”
- [ ] Create n8n workflows for the three POST endpoints
- [ ] Optional: implement import from n8n
- [ ] E2E test flows in dev and production n8n URLs

### Example n8n workflow (event change)
- Webhook (POST /webhook/tampana/event-change)
- IF (auth header present and valid) → else respond 401
- Switch on `type` → three branches
  - created/updated: upsert event in DB/sheet; notify Slack/Email (optional)
  - deleted: mark as deleted
- Respond 200 JSON `{ ok: true }`

### Testing plan
- Unit test `n8nClient` (retry/backoff/queue)
- Manual flows:
  - Create/Update/Delete event in UI → n8n receives payload
  - Export/summary send → n8n receives
  - Offline mode: create 3 events offline → queue flushes on reconnect

### Rollout
- Phase 1: POST to n8n only (no imports)
- Phase 2: add import endpoint + merge rules
- Phase 3: bi‑directional sync with conflict resolution

### Future enhancements
- Signed payloads (HMAC) using a shared secret
- Batch sync and delta tokens
- Per‑user namespace if multi‑user support is added later

