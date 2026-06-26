# NOON — Sunscreen for the long days

A clean, modern marketing site for **NOON**, a concept men's sunscreen brand. Lightweight
SPF 50, broad spectrum, no white cast, no grease, fragrance-free — positioned for guys who are
actually outside and want an SPF they'll actually wear.

> NOON is a **brand & design concept** (a demo site) — not a product for sale and not medical
> advice. For real sun protection, use an approved broad-spectrum sunscreen and follow the label.

## Design

Premium-minimal, "quiet luxury" direction:

- **Palette:** warm bone/sand backgrounds, charcoal ink, a single muted clay accent.
- **Type:** Fraunces (display serif) for headlines, Hanken Grotesk (grotesk sans) for UI/body.
- **Feel:** generous whitespace, hairline borders, restrained motion — no heavy effects.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | Single-page site + inline product SVGs (tube, body bottle, sun stick) |
| `css/styles.css` | Premium-minimal theme, layout, responsive rules |
| `js/script.js` | Mobile nav, gentle scroll reveal, form + add-to-bag demos |
| `sw.js` | Network-first service worker so a normal refresh always loads the latest deploy |

## Sections

Hero · trust strip · the SPF · why NOON · what's inside · the line (3 SKUs) · how to use ·
reviews · FAQ · shop/CTA · footer.

## Run it

Static site, no build step:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Hosting

Deployed via **GitHub Pages** (branch deploy from the project's default branch). The service
worker (`sw.js`) uses a network-first strategy, so once it's installed, every normal refresh
shows the latest published version — no hard refresh needed.
