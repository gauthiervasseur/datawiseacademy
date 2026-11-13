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

- Markup: `contacts/index.html` (also `sample-page/index.html`) — same fields and CSS classes as before.
- Script: `wp-content/themes/datawiseacademy/assets/js/contact-form.js` — validates, submits via `fetch`, then redirects to `/thank-you/`.

**Setup:** create a form at formspree.io, then replace `YOUR_FORM_ID` in the `action` attribute of the form in both pages with your form ID. Until then, submitting shows "The contact form is not configured yet".

## Known limitations

- WordPress leftovers: `hello-world/`, `sample-page/`, `category/`, `author/` (can be deleted).

## Going live on GitHub Pages

1. Push to `main`, then *Settings → Pages → Deploy from branch → main / (root)*.
2. Check the site at the github.io URL.
3. Set the custom domain `datawiseacademy.com` in *Settings → Pages* (this creates a `CNAME` file) and update DNS:
   - Apex `A` records: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` → `CNAME` → `<user>.github.io`
4. Enable *Enforce HTTPS* once the certificate is issued.
