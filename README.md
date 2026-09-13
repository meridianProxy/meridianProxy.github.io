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

**Step 2 — public repo.** Done: `meridianProxy/meridianProxy.github.io`.

The name is deliberate. `meridianProxy.github.io` is a *user site* repo, so it
serves at the bare root with no subpath:

```
https://meridianproxy.github.io/
```

**Step 3 — push.** Done. From a fresh clone it is only:

```bash
git remote add origin https://github.com/meridianProxy/meridianProxy.github.io.git
git push -u origin main
```

Commits use a GitHub noreply identity, so no personal email sits in the history:

```bash
git config user.name "meridianProxy"
git config user.email "328706122+meridianProxy@users.noreply.github.com"
```

The numeric prefix is the account id. GitHub needs it for recently created
accounts to link commits to the profile — without it the commit still pushes
but shows up unattributed.

**Step 4 — Pages source.** Already set to `GitHub Actions`, and the included
workflow at `.github/workflows/deploy.yml` rebuilds and republishes on every
push to `main`.

**Step 5 — live:**

```
https://meridianproxy.github.io/
```

HTTPS is automatic, and a deploy takes about a minute.

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

`meridianproxy.github.io` looks like a hobby project. A real domain makes
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

## Checklist

Verified in the deploy that published this site:

```
[x] burner GitHub account, burner git identity
[x] repo public, Pages source = GitHub Actions
[x] action finished green, site loads over HTTPS
[x] policy page loads and all four anchors work (terms, privacy, refunds, aup)
```

Still yours to confirm — none of these are checkable from the build:

```
[ ] Telegram handle is really yours: src/App.tsx points at t.me/QuotaPingBot
[ ] prices read through — they match what you actually charge
[ ] all buttons open a chat with you
[ ] checked on a phone (hero, pricing, FAQ, menu)
[ ] custom domain added, Enforce HTTPS ticked
```
