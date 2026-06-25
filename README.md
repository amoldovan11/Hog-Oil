# HOG OIL&trade; — Heavy-Duty Sunscreen Grease

A bold, industrial marketing site for **HOG OIL**, a (fictional) "war-grade" SPF 50 sunscreen
packaged like a can of heavy-duty grease. The design is inspired by classic automotive grease
cans — think Lucas Red 'n' Tacky — with a red / black / bone color scheme, condensed industrial
typography, and a hand-built SVG can as the centerpiece.

> ⚠️ This is a satirical / fictional product and marketing concept. It is not a real sunscreen
> and not medical advice. For actual sun protection, use an approved broad-spectrum SPF and
> follow the label.

## What's here

| File | Purpose |
| --- | --- |
| `index.html` | The single-page site (semantic markup + inline SVG can) |
| `css/styles.css` | All styling — industrial theme, layout, animations, responsive rules |
| `js/script.js` | Mobile menu, scroll reveals, can clone/tilt, form + "add to crate" demos |

## The can

The product can is a hand-authored inline **SVG** (`#theCan` in `index.html`):

- Cylindrical steel body with gradient shading to fake a 3D curve
- Steel lid with concentric rings + highlight
- Black top/bottom bands with gold pinstripes
- Big **HOG OIL** wordmark, a boar emblem, an **SPF 50** starburst badge
- Spec text (zinc oxide %, net weight, warnings)

It's cloned into the hero by `js/script.js`, which **namespaces the SVG's internal ids** so the
duplicated gradients/filters stay valid.

## Run it

It's a static site — no build step, no dependencies. Open `index.html` directly, or serve it:

```bash
# Python
python3 -m http.server 8000
# then visit http://localhost:8000

# or Node
npx serve .
```

## Design notes

- **Fonts:** Anton (display), Barlow Condensed / Oswald (body), Special Elite (stencil accents) via Google Fonts.
- **Palette:** `--red #ce1126`, `--black #0b0b0b`, `--bone #f4ecd8`, `--gold #f2a900`.
- **Accessibility:** semantic landmarks, `aria-label`s on the SVG and icons, visible focus styles,
  and `prefers-reduced-motion` support (animations + scroll reveal disabled).
- **Responsive:** grid layouts collapse at 940 / 760 / 560 px breakpoints; a burger menu appears on mobile.

## Sections

1. **Hero** — headline, the floating can, key stats
2. **The Can** — product hardware breakdown
3. **Why Hog Oil** — six feature cards
4. **Spec Sheet** — technical data table
5. **Deployment** — 3-step how-to
6. **Field Reports** — testimonials
7. **Resupply** — pricing + newsletter signup
