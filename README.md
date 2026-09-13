# Meridian — website

React + Vite single page, built from the Xero hero template. Same dark UI,
same gradient arc, same crosshatch grid, same animated icon pipeline — the
content is now the Meridian residential proxy service.

---

## The one line you edit

Open `src/App.tsx` and set your sales channel at the top:

```ts
const TELEGRAM = 'https://t.me/YourHandle'
const TELEGRAM_LABEL = 'Get access'
```

Every "Get access" button, plan button and footer link uses those two values,
so there is nothing to find-and-replace. **Until you change it, every button
points at `https://t.me/YourHandle`.**

Also set `USERNAME` — no, there is none in this version. Nothing else needs a
placeholder replaced. The page title, description and favicon are already
Meridian's.

---

## Files

```
index.html              page shell, meta tags, favicon, Inter font
src/App.tsx             the whole page + the copy constants
src/styles.css          design system (template rules + new section styles)
public/policies.html    terms, privacy, refunds and acceptable use in one page
public/legal.css        styling for the policy page
public/.nojekyll        stops GitHub running Jekyll over the build output
.github/workflows/      automatic deploy to GitHub Pages
vite.config.ts          base: './' so the build works from any URL
```

### Where the content lives

Everything is data at the top of `src/App.tsx` — edit the arrays, not the
markup:

| Constant | Controls |
|---|---|
| `TELEGRAM`, `TELEGRAM_LABEL` | every call to action |
| `NAV_LINKS` | top navigation |
| `TOOLING` | the icon row under the hero (Scrapy, Playwright, ...) |
| `FEATURES` | the six network tiles |
| `STEPS` | the three onboarding steps |
| `PLANS` | the four pricing tiers |
| `FAQ` | the accordion |

The hero heading and sub-line are plain JSX just below the pipeline.

---

## A bug I fixed in the template

In the original `App.tsx`, `gradientRef` was declared and the animation effect
**required** it before running:

```ts
if (!pipeline || ... || !gradient || !splash) return
```

but the `<linearGradient id="beam-gradient">` never had `ref={gradientRef}`
attached. So `gradient` was always `null`, the effect returned immediately, and
**the beam animation never ran** — no connector line, no travelling light, no
splash, no node glows. The DOM after mount proved it: the beam paths had no `d`
attribute at all.

Fixed by attaching the ref. Verified in a real browser after the fix:

```
<path class="beam-core" ... d="M 210.5,26 L 335.5,26 L 460.5,26">
<linearGradient id="beam-gradient" ... x1="-0.85%" x2="9.15%">
<div class="icon-node node-light-right active">
```

Real geometry from the live layout, the gradient being moved by the animation
loop, and the phase state machine already toggling node glows.

---

## Running it locally

```bash
npm install
npm run dev          # http://localhost:5173
```

```bash
npm run build        # type-checks, then builds to dist/
npm run preview      # serve the built output
```

`npm run build` runs `tsc -b` first, so a TypeScript error fails the build
instead of shipping.

---

## Publishing on GitHub Pages (free)

**Step 1 — burner GitHub account.** Not your personal one. The site is public
and permanently tied to whatever account publishes it.

**Step 2 — create a public repo** named `meridian` (the repo name becomes part
of the URL).

**Step 3 — push this folder:**

```bash
git init
git add .
git commit -m "Meridian site"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/meridian.git
git push -u origin main
```

Set a burner identity first so your real name is not in the commit history:

```bash
git config user.name "Meridian"
git config user.email "desk@your-domain.com"
```

**Step 4 — turn on Pages.** In the repo: **Settings → Pages → Build and
deployment**, set **Source** to `GitHub Actions`. That's it — the included
workflow at `.github/workflows/deploy.yml` builds the site and publishes it on
every push to `main`.

**Step 5 — wait for the action to finish** (Actions tab, about a minute) and
open:

```
https://YOUR-USERNAME.github.io/meridian/
```

HTTPS is automatic.

### Alternative: no Actions

If you would rather not use the workflow, build locally (`npm run build`) and
drag the **contents of `dist/`** into the repo root, then set Pages to
`Deploy from a branch → main → / (root)`. You must rebuild and re-upload after
every edit, which is why the workflow is the better option.

### Updating the site

Change a file, commit, push. The action rebuilds and republishes in about a
minute. Nothing to run locally.

---

## Custom domain (optional, ~$10/year)

`your-name.github.io/meridian` looks like a hobby project. A real domain makes
it look like a company.

1. Buy it with WHOIS privacy on (Namecheap, Porkbun, Cloudflare).
2. Repo **Settings → Pages → Custom domain** → enter it → save.
3. At the registrar, add DNS:
   - `CNAME` `www` → `YOUR-USERNAME.github.io`
   - `A` for the bare domain → `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
4. Once DNS resolves, tick **Enforce HTTPS**.

Pick a name that does not describe the service in a searchable way. A domain
containing "proxy" is found by anyone Googling proxies; a clean brand name
is not.

---

## Ground rules

**The site carries no endpoints, no IPs, no ports and no credentials.** Keep it
that way. Its job is to look professional and route buyers to your Telegram
handle — access details are issued after payment, in the chat. Publishing your
gateway address on a public page links the brand to your infrastructure and
invites every scanner on the internet.

**Git history is public and permanent.** Once committed, it stays, and forks
keep it. Never commit: your real name or personal email, the server address,
SSH keys, admin tokens, customer usernames, balances, or screenshots of your
panel.

**Keep the layers separate.** Brand assets (this site, the domain, the Telegram
handle) should never point at operational assets. A takedown of one should not
expose the other.

---

## Checklist before going live

```
[ ] TELEGRAM constant set in src/App.tsx
[ ] prices read through — they match what you actually charge
[ ] burner GitHub account, burner git identity
[ ] repo public, Pages source = GitHub Actions
[ ] action finished green, site loads over HTTPS
[ ] all buttons open a chat with you
[ ] policy page loads and all four anchors work
[ ] checked on a phone (hero, pricing, FAQ, menu)
[ ] custom domain added, Enforce HTTPS ticked
```
