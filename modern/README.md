# Life100 React + TypeScript
React 19, TypeScript, Vite 8, Zod, Fuse.js, React Markdown/GFM, Lucide, Workbox PWA. Legacy app retained for rollback. Original storage is migrated, except detailed people/adventures and sport views remain exportable but not yet ported.

## Local development
Node 22.12+ (prefer Node 24). In modern/: npm install; npm run dev; npm test; npm run build. Commit a generated lockfile after verifying dependency resolution. PWA uses /life100/ for GitHub Pages.

## Private gateway
Create a separate **private** GitHub repository with an initial README, then a fine-grained token limited to that repo with Contents read/write. Configure GITHUB_REPOSITORY, OPENAI_MODEL and ANTHROPIC_MODEL as Wrangler variables. Use model IDs available in your API accounts. Set ALLOWED_ORIGIN to the exact frontend origin (http://localhost:5173 for dev). Set secrets using:
    npx wrangler secret put ACCESS_TOKEN
    npx wrangler secret put GITHUB_TOKEN
    npx wrangler secret put OPENAI_API_KEY
    npx wrangler secret put ANTHROPIC_API_KEY
Use a random access token of at least 32 characters. Run npm run gateway:deploy, then enter gateway HTTPS URL and access token in Settings. For local worker use ignored .dev.vars and npm run gateway:dev. Never commit credentials. Provider API billing is separate from consumer subscriptions. This is a single-user gateway; configure rate limits, authentication and rotation before broader access.

AI Studio sends only the prompt and optionally the selected note; web search is opt-in. Output can be saved as a new note or replace a selected note only after confirmation. No autonomous writes. Sources displayed if returned.

GitHub sync is manual: Check remote, then Push or Restore. Expected blob SHA protects against concurrent overwrites. Full JSON snapshots (max 800 KB) are committed to the private repository. The gateway checks repo visibility. Snapshots are plaintext, remain in Git history, and are readable by authorized collaborators; never put passwords or secrets here. Export before restoring. No automatic merge or background sync. Local JSON and Markdown exports work without the gateway.

## Deploy
CI checks tests and build on PR. After merging and testing, change Settings → Pages → Source to GitHub Actions and manually run Deploy Life100 React on main. The legacy site remains live until that switch and successful deployment. Test migration, mobile install, offline reload and real gateway calls first. If legacy service worker controls the page, close/reopen or clear only service worker/cache, not local storage.

## Engineering workflow

Use Node 24 (`.nvmrc`). Install with `npm ci` once the generated `package-lock.json` is committed. The CI bootstrap publishes the resolved lockfile as an artifact if it is not yet present; download and commit that exact lockfile before deploying. `npm run check` runs ESLint, unit tests and the production build. `npm run test:e2e` runs desktop/mobile Chromium smoke tests against the built preview. `npm run format` applies Prettier; `npm run format:check` is available but is not a required CI gate until the existing compressed source is formatted. Production deployment requires the lockfile, checks, browser tests, and a high-severity production dependency audit. Dependabot proposes weekly compatible updates. TypeScript 6 is intentional because the configured TypeScript ESLint version does not officially support TypeScript 7 yet.
