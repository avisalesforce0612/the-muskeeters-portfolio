# The Musketeers — Portfolio

Independent band portfolio built with React, TypeScript, Vite, and Three.js. GitHub is the source of truth; no Lovable runtime or deployment dependency.

## Run locally
Requirements: Node.js 20+, npm.

```bash
git clone https://github.com/avisalesforce0612/the-muskeeters-portfolio.git
cd the-muskeeters-portfolio
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Vite outputs to `dist/`, deployable to any static hosting provider. Connect the repository to your preferred host; use `npm install` and `npm run build`, with `dist` as the output directory.

### Publish with GitHub Pages
The repository includes a GitHub Actions workflow that builds and deploys the `main` branch to GitHub Pages. The workflow attempts to enable Pages automatically; if GitHub requires it, select **Pages → Build and deployment → GitHub Actions** in the repository settings. Add the restricted, rotated Drive key under **Settings → Secrets and variables → Actions** as `VITE_GOOGLE_DRIVE_API_KEY`. Add `https://avisalesforce0612.github.io/*` to the key's HTTP referrer restrictions. A push to `main` or a manual workflow run publishes the site at `https://avisalesforce0612.github.io/the-muskeeters-portfolio/`.

When connecting a custom domain, set the workflow's `VITE_BASE_PATH` to `/` and configure the domain under **Pages → Custom domain**. Add the DNS records GitHub provides at the domain registrar (Hostinger); the domain purchase itself does not include hosting.

## Content configuration
Booking enquiries open WhatsApp to **+91 81728 52397** with the form details prefilled; the visitor must tap Send in WhatsApp. The booking email is **ohthosemusketeers@gmail.com**, and Instagram is [@wearemuskeeters](https://www.instagram.com/wearemuskeeters/). These contacts are centralized in `src/siteConfig.ts`. The official illustrated logo lives at `public/the-musketeers-logo.png`. The lineup uses clearly identified placeholders until real member names and approved photography are available. The desktop live-stage journey follows page scroll; smaller screens and reduced-motion preferences use a lightweight, static version.

### Add photos and videos through Google Drive
The portfolio can read images and videos directly from one public Drive folder. Configure this once; after that, add media to the folder and it will appear on the site automatically (the feed refreshes every five minutes).

1. The band's folder ID is already set in `src/siteConfig.ts`. Share [the connected Drive folder](https://drive.google.com/drive/folders/1ywljKfN_T7o9HOm5SlyVmgADyIJkgD6A) as **Anyone with the link — Viewer**. Files should be placed directly in this folder; subfolders are not scanned.
2. In a Google Cloud project, enable **Google Drive API** and create an API key. Restrict the key to the Drive API and to your website's HTTP referrers (include localhost for local development). This read-only browser key is included in the built site, so referrer restrictions are important; do not grant it write access.
3. Copy `.env.example` to `.env.local` and set `VITE_GOOGLE_DRIVE_API_KEY` to the restricted key. The folder ID is already configured; optionally set `VITE_GOOGLE_DRIVE_FOLDER_ID` if you need to override it. Restart the dev server after editing environment variables.
4. Add the API key to your hosting provider's build environment, then redeploy. For GitHub Pages, follow the setup above and use a GitHub Actions secret. Keep `.env.local` out of version control.
5. Upload image and video files directly into that folder. Photos appear in the band and live sections; videos appear as playable live clips. Descriptive filenames are used as captions. Newly added files appear within five minutes or after a page refresh.

If the folder or API key is not configured, the site shows honest empty-state guidance instead of pretending media is connected. Drive/API failures are surfaced in the live section.

## Project structure
- `src/App.tsx` — page sections, navigation, booking form
- `src/components/StageScene.tsx` — scroll-driven Three.js stage journey
- `public/the-musketeers-logo.png` — official band logo
- `src/siteConfig.ts` — band details and media links
- `src/styles.css` — responsive styles
- `.github/workflows/` — CI and GitHub Pages deployment

Before launch: add real photos and footage, configure the booking destination, test on real phones, and confirm `npm run build` succeeds.
