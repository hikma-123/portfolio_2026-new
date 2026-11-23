# portfolio.com
hikma

Personal portfolio of **Iynul Hikma Hasan**, freelance frontend developer and UI/UX designer, Colombo.

## Folder structure

```
portfolio.com/
├── index.html                 ← the whole page
├── css/
│   ├── tailwind.css           ← pre-built Tailwind (no CDN needed)
│   └── style.css              ← custom styles + all motion/animations
├── js/
│   └── main.js                ← loader, scroll animations, filters, lightbox, menu, theme
├── images/
│   ├── h1.webp, h2.webp       ← portraits
│   ├── w1–w3                  ← web project screenshots
│   ├── lo1–lo8.png            ← logos
│   ├── po1–po17               ← posters (po17 = Greenharvest Ceylon Cloves, the newest)
│   └── favicon.svg
├── fonts/                     ← Inter + Playfair Display (local)
├── vendor/fontawesome/        ← icons (local)
├── assets/cvv.pdf             ← CV download
├── dev/                       ← only needed to rebuild tailwind.css
├── .github/workflows/static.yml  ← GitHub Pages deploy
└── .nojekyll
```

Everything is local, so the site works offline and on GitHub Pages without relying on outside CDNs.

## Add a new poster

1. Put the image in `images/` (e.g. `po17.jpeg`).
2. In `index.html`, find `<div id="posterGrid"` and copy one `<button ... class="poster-card ...">` block.
3. Change `data-src`, both `src` attributes, the title text, and `data-cat`
   (`food`, `fashion`, `travel` or `branding`). Keep `<span class="badge-new">New</span>` to show the NEW badge.

## Rebuilding Tailwind (only if you add new Tailwind classes)

```
cd dev
npm install
npm run build
```

## Run locally

Open `index.html` directly, or from this folder run `python -m http.server` and visit http://localhost:8000.

## Sections

Home → About → **Skills** → **Services** → **Packages** (+ single services and "How it works") → Projects → Contact (+ WhatsApp enquiry form).

The skill illustrations are inline SVGs in `index.html`, animated by CSS in `css/style.css`.
They use the theme colours, so they switch automatically in dark mode.

## Change prices or packages

In `index.html`, search for `PACKAGES`. Each package has:
- the price (`<b>35,000</b>`)
- a list of what the client gets (`<ul class="check-list">`)
- a "Book on WhatsApp" link with the package name and price in the message

If you change a price, update it in all three places: the card, the WhatsApp link text, and the
`<select>` options in the enquiry form (search for `waForm`).

## WhatsApp number

The number is `94743890704` (international format, without the +). It appears in the `wa.me/...` links in
`index.html` and once in `js/main.js` (enquiry form).

## Images

Large PNGs were converted to WebP (po1, po2, po3, po6, w2, h1, h2), so the page loads much faster.

## Theme colours

Set in `css/style.css` under `:root` (light) and `html.dark` (dark):

| Name     | Light               | Role                     |
|----------|---------------------|--------------------------|
| `ink`    | Black `#111111`     | Text and dark surfaces   |
| `accent` | Light red `#E63946` | Highlights and buttons   |
| `paper`  | Soft white `#FFFAFA`| Background               |

Change the three RGB values there to re-theme the whole site. Tailwind classes use the same names
(`text-accent`, `bg-ink`, `border-ink/15`, and so on). Run the Tailwind rebuild only if you add new classes.
