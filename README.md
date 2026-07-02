# Local Audit Cashflow Kit

This is a static, dependency-free sales kit for selling paid local business growth audits. It gives you:

- `index.html`: operator dashboard for pricing, prospect audits, outreach copy, pipeline tracking, report export, and config export.
- `offer.html`: buyer-facing offer page that can link to Stripe Payment Links, a booking page, or email.
- `docs/`: GitHub Pages deployment folder. The public root serves the buyer-facing offer, not the operator dashboard.
- `config.js`: public offer settings for deployed pages.
- `assets/audit-preview.png`: product visual used by the offer page.

No revenue is guaranteed. The app is designed to make a real offer easy to sell, deliver, and track.

## Live site

Public offer page:

```text
https://julianbrown-afk.github.io/blank-map-local-growth-audit/
```

Sample report:

```text
https://julianbrown-afk.github.io/blank-map-local-growth-audit/sample-audit.html
```

Niche offer pages:

```text
https://julianbrown-afk.github.io/blank-map-local-growth-audit/lexington-dentist-growth-audit.html
https://julianbrown-afk.github.io/blank-map-local-growth-audit/lexington-med-spa-growth-audit.html
https://julianbrown-afk.github.io/blank-map-local-growth-audit/lexington-roofing-remodeling-growth-audit.html
```

Source repo:

```text
https://github.com/julianbrown-afk/blank-map-local-growth-audit
```

## Run locally

From this folder:

```powershell
python -m http.server 4173
```

Open:

```text
http://localhost:4173/index.html
```

## Monetize it

1. Create a Stripe Payment Link for the audit price.
2. Open `index.html`, paste the Stripe link, add your email, business name, and mailing address.
3. Click `Download config` and replace this folder's `config.js` with that downloaded file before deploying.
4. Send prospects the generated offer link, or use the closest niche offer page when it matches the prospect.
5. Use the dashboard to generate one paid report per prospect and add each lead to the pipeline.

Stripe's current Payment Links documentation says payment links can be shared online and embedded as buy buttons, so this static approach does not need a backend for checkout.

## Outreach compliance notes

The generated email includes sender identity, contact information, a mailing address field, and an opt-out sentence. Keep those accurate. FTC CAN-SPAM guidance says commercial email should not use misleading header information or deceptive subject lines, must include a valid physical postal address, and must provide a way to opt out.

The public config intentionally does not expose the private business address. The address is stored only in `.private/business-address.txt`, which is excluded by `.gitignore`. Do not send cold commercial outreach from the generated email until a valid public mailing address, PO box, or compliant commercial mail receiving address is added to the email footer.

## Suggested starting offer

- Audit: `$399`
- Implementation sprint: `$1,500`
- Target: local service businesses with weak booking flow, review gaps, thin Google Business Profile content, or no lead tracking.
- Daily motion: 10 to 15 researched prospects, personalized email, then one follow-up with the generated audit preview.
