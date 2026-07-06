# Playwright Mobile Audit - 2026-07-06

- Target: local production build at `http://127.0.0.1:3000`
- Device profile: Playwright `Pixel 5`
- Routes checked: 18
- Expected statuses: normal routes `200`, missing-page route `404`
- Result: all checked routes had one `h1`, had no replacement characters, had no horizontal overflow, and emitted no unexpected console errors.
- Custom 404 check: `/missing-page-for-audit`
- Machine-readable result: `summary.json`
- Screenshots: `*--mobile.png`

Remaining note: public `https://seniordeundun.com` still needs redeploy/cache verification because the earlier live check showed replacement characters on the currently deployed HTML while this local production build is clean.
