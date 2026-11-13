# Prioritized SEO Action Plan: Vintage Vogue India
**Framework:** Agentic-SEO-Skill Action Matrix  
**Status:** All Immediate Blockers & Quick Wins Implemented & Verified in Codebase

---

## 1. Immediate Blockers (Executed & Verified)

- [x] **Deploy Schema.org Knowledge Graph**
  - **Impact:** High (Enables rich snippets, Google Merchant integration, local pack inclusion)
  - **Effort:** Completed in [index.html](file:///c:/Users/jackx/OneDrive/Desktop/vintage/index.html)
  - **Verification:** Includes `ClothingStore`, `Product`, `BreadcrumbList`, and `FAQPage` schemas with Indian Rupee locking and Kota coordinates.

- [x] **Configure AI Crawler Access & Robots Protocol**
  - **Impact:** High (Allows ChatGPT Search, Perplexity AI, Claude, and Google AI Overviews to crawl and cite inventory)
  - **Effort:** Completed in [public/robots.txt](file:///c:/Users/jackx/OneDrive/Desktop/vintage/public/robots.txt)
  - **Verification:** Explicitly whitelisted `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`.

- [x] **Create PWA Web App Manifest for Mobile WebApp SEO**
  - **Impact:** High (Mobile installability, standalone mobile execution, mobile-first ranking signal)
  - **Effort:** Completed in [public/manifest.json](file:///c:/Users/jackx/OneDrive/Desktop/vintage/public/manifest.json)
  - **Verification:** Linked in `index.html` with theme-color `#181513` and navigation shortcuts.

---

## 2. Quick Wins (Executed & Verified)

- [x] **Publish `llms.txt` and `llms-full.txt` for GEO (Generative Engine Optimization)**
  - **Impact:** Medium-High (Establishes authority in Perplexity and ChatGPT source quoting)
  - **Effort:** Completed in [public/llms.txt](file:///c:/Users/jackx/OneDrive/Desktop/vintage/public/llms.txt) and [public/llms-full.txt](file:///c:/Users/jackx/OneDrive/Desktop/vintage/public/llms-full.txt)
  - **Verification:** Formatted with Markdown links, studio provenance, and 10 specimen dossiers.

- [x] **XML Image Sitemap Deployment**
  - **Impact:** Medium (Faster indexing of 1-of-1 product images on Google Images)
  - **Effort:** Completed in [public/sitemap.xml](file:///c:/Users/jackx/OneDrive/Desktop/vintage/public/sitemap.xml)
  - **Verification:** Fully declared in `robots.txt` with weekly change frequencies.

- [x] **Core Web Vitals Font CLS Mitigation**
  - **Impact:** Medium (Reduces layout shifts; prevents FOIT)
  - **Effort:** Completed in [index.html](file:///c:/Users/jackx/OneDrive/Desktop/vintage/index.html)
  - **Verification:** Added `&display=swap` parameter to Google Fonts import.

---

## 3. Strategic Growth & Post-Launch Roadmap

1. **Google Search Console & Bing Webmaster Tools Registration**
   - Submit `https://vintagevogue.in/sitemap.xml` upon domain DNS propagation.
   - Monitor indexing coverage and mobile usability reports.

2. **Google Business Profile (GBP) Verification**
   - Claim and verify *Vintage Vogue India* at Sogaria / Workshop Road, New Basti, Kota, Rajasthan – 324002.
   - Link Google Maps location to studio opening hours (10:30 AM – 8:30 PM IST).

3. **Instagram `@vintagevoguee_in` Community Cross-Linking**
   - Embed weekly Instagram drop reels directly on the site.
   - Maintain bio link pointing directly to `https://vintagevogue.in/`.

4. **Merchant Center Automated Catalog Sync**
   - Connect the REST API endpoint `/api/products` to Google Merchant Center Content API for free Google Shopping product carousel listings.

