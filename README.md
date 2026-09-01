# Program website — build, deploy, and Exhibit 4.21 capture

Static site. No build step, no dependencies, no trackers. Company home, feed-program pages,
one neurotechnology page, plus one stylesheet and one small script. It is written to serve two
purposes at once: the public face of NeuraNext Solutions LLC, and **Exhibit 4.21** in the I-140
petition. The NIW proposed endeavor is the feed program only.

```
website/
  index.html          Company (two programs)
  feed.html           Feed program — The Endeavor
  status.html         Development Status  ← the evidentiary core
  science.html        Scientific Basis
  regulatory.html     Regulatory Posture (feed)
  participate.html    Producers & Researchers (enquiry form)
  neuro.html          Neurotechnology research line (early-stage)
  about.html          About the principal
  assets/style.css
  assets/site.js
  sitemap.xml
  robots.txt
  INQUIRY_LOG.csv     template for the enquiry log
  _validate.py        pre-publish checker (not part of the deployed site)
```

To preview locally, run `python -m http.server 8000` in this folder and open
`http://localhost:8000`.

Before publishing, and after any edit, run `python _validate.py`. It checks internal links and
anchors, confirms the development-stage banner and footer notice are present on every page, lists
remaining `REPLACE_` placeholders, and scans for claim language of the kind ruled out in §6. It
distinguishes an affirmative claim from a denial, so the disclaimers themselves do not trip it.
Delete this file before deploying if you prefer, or leave it — it is never served as a page.

---

## 1. Fill the placeholders before publishing

Every placeholder is an uppercase `REPLACE_` token. Find them with a text search across the folder.

| Token | Replace with | Appears in |
|---|---|---|
| `REPLACE_EMAIL` | Program email address on your own domain (e.g. `research@yourdomain.com`) | all pages |
| `REPLACE_CITY`, `REPLACE_STATE` | Your U.S. city and state | all page footers |
| `REPLACE_REVIEW_DATE` | Date you last reviewed that page, e.g. `30 August 2026` | all page footers |
| `REPLACE_DATE` | Human-readable entry date, e.g. `12 March 2026` | `status.html` log (6 entries) |
| `REPLACE_ISO_DATE` | Same date in `YYYY-MM-DD` form for the `datetime` attribute | `status.html` log (6 entries) |
| `REPLACE_WITH_FORM_ENDPOINT` | Your form endpoint URL (see §3) | `participate.html` |
| `REPLACE_DOMAIN` | Your live domain | `sitemap.xml`, `robots.txt` |

**Use only true dates in the development log.** Each entry must match a real, documented milestone —
the same ones evidenced at Exhibits 4.15, 4.16, 4.19, and 5.2. If you cannot date an entry from a
document in the file, delete the entry. A log with an unverifiable date is worse than a shorter log.

---

## 2. Third-party names are deliberately omitted

The site refers to "a research faculty member at a Land-Grant university Cooperative Extension
program" and "a commercial poultry producer in Kentucky" rather than naming Kentucky State
University, Dr. Bebe, Action Jackson Farms, or Ms. Jackson.

That is intentional. Do not add those names unless you have **written permission** from each. Naming
an institution on a public site can be read as implying institutional endorsement or partnership,
which is exactly the overstatement we removed from the petition. Your petition already names them
properly, with their own letters as support — that is where the evidentiary weight belongs.

Same rule for your employer: the About page says "the U.S. animal-health industry" and does not name
Merck. Keep it that way. Naming an employer alongside an independent venture invites both a
conflict-of-interest read and an employer problem.

---

## 3. Enquiry form

The form posts to whatever URL is in the `action` attribute. Until you set one, `assets/site.js`
detects the unconfigured placeholder and falls back to opening a pre-filled email, so no enquiry is
ever silently lost.

Two straightforward options:

- **Netlify Forms** — deploy on Netlify, add `netlify` as an attribute on the `<form>` tag, and
  submissions appear in your dashboard. No endpoint URL needed.
- **Formspree** — create a form, paste the endpoint into `action`.

Either way, keep a copy of every submission. The enquiry log is the evidence, not the form.

---

## 4. Deploy

Any static host works. The live domain is **`neuranextsolutions.com`**.

**Vercel (recommended)**
1. Sign in at vercel.com and import this repository.
2. Leave the framework preset as **Other** — there is no build step; the site root is the deploy root.
3. Deploy. Vercel serves `index.html`, `sitemap.xml`, `robots.txt`, and the `assets/` folder as static files.
4. Project → **Settings → Domains** → add `neuranextsolutions.com` and `www.neuranextsolutions.com`.
5. At your domain registrar, add the DNS records Vercel shows:
   - **Apex** (`neuranextsolutions.com`): `A` → `76.76.21.21`
   - **www**: `CNAME` → `cname.vercel-dns.com`
6. Wait for Vercel to issue the SSL certificate (usually a few minutes after DNS propagates).

**Netlify (drag and drop)**
1. Sign in at netlify.com.
2. Drag the site folder onto the deploy area.
3. Add `neuranextsolutions.com` under Domain settings.

**GitHub Pages**
1. Push this repository to GitHub with the site at the repo root.
2. Settings → Pages → Source: `main`, folder `/root`.
3. Add `neuranextsolutions.com` as the custom domain and enable HTTPS.
4. Add a `CNAME` file at the repo root containing `neuranextsolutions.com`.

**Domain and email.** Point DNS to the static host and enable HTTPS. Set up a matching email
address on the domain (`research@neuranextsolutions.com`). A default `*.vercel.app` address
undercuts the credibility the site is meant to establish.

The company and the website are one. The site has two program arms. For the I-140, the
**proposed endeavor is only the feed program.** Exhibit 4.21 should lead with the feed pages
(`feed.html`, `status.html`, `science.html`, `regulatory.html`, `participate.html`) plus the
company home so the officer sees the entity. The neurotechnology page must stay early-stage
and claim-free so it identifies the second arm without becoming a second NIW endeavor.

---

## 5. Keep the log current — this is the part that matters

The site earns its evidentiary weight from **dated updates over time**, not from existing. A page
that has not changed since the week you filed looks like it was built for the filing.

Update `status.html` whenever any of these happens, and re-capture the PDF:

- a supplier, laboratory, or CRO quotation is received
- an analytical method or stability run is completed
- the entity is formed, or IP is filed
- a research or Extension discussion produces a written outcome
- a phase gate is passed

---

## 6. Compliance rules — non-negotiable

Your petition now states in writing, to USCIS, that no disease-prevention claim will be made except
as the regulatory pathway permits. The site must not contradict that document.

**Never write, anywhere on the site:**

- that the product prevents, treats, controls, mitigates, cures, or reduces HPAI or any disease
- that it reduces mortality, viral load, viral shedding, infection rates, or culling
- "protects your flock", "HPAI protection", "immunity booster", "proven", "effective", "works"
- testimonials or endorsements implying performance
- any suggestion the product is available, for sale, in stock, or priced

**Always keep:**

- the development-stage banner at the top of every page
- the full footer notice on every page
- the "What has not yet been established" section on `status.html`
- the `regulatory.html` page reachable from every page

Describe published research on individual compounds in reporting language — "reported in the
peer-reviewed literature as having been studied for" — and never in a way that transfers those
findings to your formulation.

---

## 7. Capture for Exhibit 4.21

Do this in the week you file, after the placeholders are filled and the site is live.

1. Open each page in Chrome on the live domain.
2. Print to PDF (`Ctrl+P` → Save as PDF). A print stylesheet is included: navigation is dropped,
   link URLs are printed after link text, and cards and table rows avoid page breaks.
3. Ensure the visible URL and the capture date appear in the header/footer of the print output
   (Chrome: enable "Headers and footers").
4. Name files in reading order:
   `4.21a_company.pdf`, `4.21b_feed_endeavor.pdf`, `4.21c_development_status.pdf`,
   `4.21d_scientific_basis.pdf`, `4.21e_regulatory_posture.pdf`, `4.21f_participation.pdf`,
   `4.21g_neurotechnology.pdf`, `4.21h_about.pdf`.
5. Export the enquiry log to `4.21i_inquiry_log.pdf`.
6. Add a one-page cover sheet stating the domain (`neuranextsolutions.com`), the date of capture, the date
   the site was first published, that NeuraNext Solutions LLC is the operating entity, and that the
   proposed NIW endeavor is the feed program.

Optionally submit an archive.org Wayback capture of the home page as independent proof of the
publication date. That is cheap corroboration and worth doing.

---

## 8. Honest assessment of evidentiary weight

Under the USCIS Policy Manual, this site supports Prong 2 as evidence of a **detailed plan**,
**progress toward the endeavor**, and **interest from potential users and other relevant entities**.
It does not establish that you are well positioned on its own, and an officer will not treat a
website as a substitute for objective evidence.

Ranked by what will actually move the second prong:

1. Hybrid Special primary sales and production records (Exhibit 4.3)
2. Written lab, CRO, and supplier quotations and scopes of work (Exhibit 4.22)
3. U.S. entity formation and ownership records (Exhibit 4.23)
4. A written response from a biocontainment or university poultry research unit
5. IP filing (Exhibit 4.24)
6. **This website** (Exhibit 4.21)

Build the site because it is genuinely useful for reaching mills, labs, and producers — and because
the inquiries it generates become items 2 and 4. Do not build it expecting it to carry the prong.
