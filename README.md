# Meridian

Static storefront for the Meridian residential proxy network.

Published at https://meridianproxy.github.io/

## Pages

Plain HTML - no build step. The `Deploy to GitHub Pages` workflow uploads the
repository root as the Pages artifact, so editing a file and pushing to `main`
is the whole deploy.

## Files

| File | Purpose |
|---|---|
| `index.html` | The storefront, self-contained (CSS and JS inline) |
| `tor.html` | Script-free build served to Tor and JS-disabled visitors |
| `terms.html` `privacy.html` `refund.html` `aup.html` | Policy pages |
| `404.html` | Not-found page |
| `legal.css` | Stylesheet for the policy pages; self-hosted font, no external request |
| `assets/logo.svg` | Favicon |
| `assets/fonts/` | Plus Jakarta Sans, self-hosted so no font host is contacted |

## Editing

`index.html` carries its own stylesheet in a single `<style>` block in the head,
sized against a 1280x800 reference render using a `--u` scaling unit. Content
lives in plain markup between the `<body>` tag and the closing `</footer>`.

Contact and purchase flow all point at the Telegram bot.

## Custom domain

Add a `CNAME` file containing the bare domain, then set the domain under
Settings -> Pages. DNS: four `A` records for the apex pointing at GitHub's
Pages addresses, and a `CNAME` for `www`.
