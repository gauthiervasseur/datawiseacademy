# Data Wise Academy — static site

Static copy of https://datawiseacademy.com (originally WordPress on SiteGround), mirrored on 2026-11-13 for hosting on GitHub Pages.

## Preview locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

Double-clicking `index.html` (a `file://` URL) also works: a small inline script (`#file-protocol-links`) rewrites folder links like `../about-us/` to `../about-us/index.html`, only when the page is opened from disk. The contact form needs `http(s)` to submit.

## Structure

- `index.html`, `about-us/`, `contacts/`, `program/<slug>/`, … — one folder per page (keeps the original URLs).
- `wp-content/`, `wp-includes/` — theme CSS/JS, fonts and images copied from WordPress.
- Internal links are relative, so the site works on a custom domain and under `https://<user>.github.io/datawiseacademy/`.
- Canonical / Open Graph URLs still point to `https://datawiseacademy.com`.

## Contact form

The original Contact Form 7 (WordPress) form was replaced by a static form that posts to [Formspree](https://formspree.io):

- Markup: `contacts/index.html` — same fields and CSS classes as before; "Interested in" is a dropdown of the programs, preselected from `?program=<slug>`.
- Script: `wp-content/themes/datawiseacademy/assets/js/contact-form.js` — validates, submits via `fetch`, then redirects to `/thank-you/`.

**Setup:** create a form at formspree.io, then replace `YOUR_FORM_ID` in the `action` attribute of the form in `contacts/index.html` with your form ID. Until then, submitting shows "The contact form is not configured yet".

## 404 page

`404.html` is the theme's "page not found" page. GitHub Pages serves it for any missing URL, at any depth, so its links and assets use root-absolute paths (`/wp-content/...`). It is fully styled on the custom domain. On the `github.io/datawiseacademy/` preview URL it appears unstyled, which is expected.

## Other pages and assets

- `privacy-policy/` — privacy policy (draft; have it reviewed before relying on it). Linked from the footer and the contact form.
- `wp-content/uploads/2026/11/share-image.png` — 1200×630 image used for link previews (`og:image` / `twitter:image` on every page).
- `program/mastering-data-foundations/`, `ai-enhanced-analytics-mastery/`, `leadership-in-the-ai-era/` — redirects from the 2025 program URLs to the 2027 pages.
- `wp-content/themes/datawiseacademy/assets/css/catalog-2027.css` — styles added for the 2027 update (Method section, program details, footer, privacy page, form).
- `llms.txt` — plain-text summary of the site and programs for AI assistants (generated).
- Structured data (`<script id="dwa-schema">` in each page): Organization, founder, program list, and one Course per program page (generated).
- `2027 Catalog/` and `site-tools/` are git-ignored: the catalog PDF and the update scripts stay on the local computer and are never published.

## Going live on GitHub Pages

1. Push to `main`, then *Settings → Pages → Deploy from branch → main / (root)*.
2. Check the site at the github.io URL.
3. Set the custom domain `datawiseacademy.com` in *Settings → Pages* (this creates a `CNAME` file) and update DNS:
   - Apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `<user>.github.io`
4. Enable *Enforce HTTPS* once the certificate is issued.
