# Life 100

A zero-build, installable personal operating system for a 100-day reset: body, mind, people, German, guitar, sport, adventures and notes.

## Included

- iPhone/desktop PWA with Home Screen installation
- Offline-first service worker
- Local-first autosave
- Daily weight, VO₂ max, sleep, steps, mood, energy and anxiety
- Daily habits, sport, German, guitar, social invitation and 3-line journal
- 100-day goals and progress bars
- People / relationship memory
- Notes / lightweight knowledge base
- Munich adventures log
- Insights and mood/social correlation
- JSON backup + JSON restore
- CSV export
- Markdown export for Capacities / Obsidian
- ICS recurring calendar export
- Apple Shortcuts URL quick-capture
- Optional Supabase cross-device sync with magic-link login
- Apple Health-ready architecture note (PWA itself cannot read HealthKit)
- No npm, no build process, no backend required for core use

## Run locally

Because service workers need HTTP(S), do not double-click `index.html` if you want full PWA/offline behavior.

From this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Deploy

This folder is already a static site. Upload it directly to GitHub Pages, Cloudflare Pages, Netlify, Vercel, or any HTTPS static host. No build command is required.

### GitHub Pages

Put these files at the root of a repository and enable **Settings → Pages → Deploy from branch** for the branch/root folder containing them.

## Install on iPhone

1. Deploy over HTTPS.
2. Open the site in Safari on iPhone.
3. Share → **Add to Home Screen**.
4. Open **Life100** from the icon.

After first load, the core app works offline.

## Cross-device sync (optional)

The app is fully useful without an account. If you want iPhone ↔ laptop synchronization:

1. Create a free Supabase project.
2. Open SQL Editor and run `supabase.sql`.
3. Ensure Email / magic-link authentication is enabled.
4. Open Life100 → Connectors.
5. Paste the Supabase project URL and anon key and save.
6. Enter your email and tap **Email sign-in link**.
7. Open the link on the same device.
8. Use **Push** and **Pull**. Sign in with the same email on every device.

The app dynamically loads the official Supabase browser client only when the Supabase connector is used. The core app has no remote JS dependencies.

## Apple Health

Safari and installed PWAs do not get direct HealthKit access. Life100 therefore keeps weight, VO₂ and steps as clean structured metrics with manual/Shortcut capture today.

If automatic HealthKit becomes worth maintaining, the next step is a small native iOS shell (Capacitor or a Swift app) that injects HealthKit values into the same data model. The rest of the UI can stay unchanged.

## Apple Shortcuts

The app accepts quick-capture URLs:

```text
?action=metric&key=weight&value=85.4
?action=metric&key=vo2&value=30.1
?action=habit&key=outside
```

The Connectors page shows full URLs based on wherever you deploy the app.

## Design rule

Using Life100 should take less time than living the day it records.
