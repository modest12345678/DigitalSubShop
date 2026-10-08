# DigitalSubShop — Premium Digital Subscriptions & Licenses Marketplace

> **Client Project Handover & Documentation**  
> **Production Domain:** [https://digitalsubshop.com](https://digitalsubshop.com)  
> **Staging / Vercel Deployment:** [https://digitalsubshop.vercel.app](https://digitalsubshop.vercel.app)  
> **Target Market:** Bangladesh (BDT ৳)  
> **Primary Fulfillment:** WhatsApp Instant Automated Dispatch (`+8801887924939`)  

---

## 📌 Project Overview

**DigitalSubShop** is a high-conversion, dark-cyber themed digital subscription marketplace built specifically for the Bangladeshi consumer market. It provides localized access to international digital services, streaming platforms, AI subscriptions, creative tools, and gaming passes without requiring international credit cards or PayPal.

### Key Business Metrics
- **Catalog:** 19 Verified Subscription Services
- **Pricing Options:** 79 Duration & Account Tier Options
- **Accepted Payments:** bKash, Nagad, Rocket (Personal Send Money)
- **Support Channels:** Direct WhatsApp 24/7 & Facebook Messenger

---

## 🚀 Key Features & Architectural Highlights

### 1. Dedicated Full Product Pages (`product.html?id=<id>`)
- High-converting e-commerce layout replacing compact modal popups.
- Dynamic 16:9 hero gallery with instant stock status badges.
- Tabbed information architecture:
  - **Description:** Complete product features & licensing specifications.
  - **Delivery & Warranty:** 1–12 hour timeline & 365-day replacement escrow policy.
  - **Why DigitalSubShop:** Value proposition & local trust factors.
- Sticky interactive purchase console with duration selector, real-time BDT calculation, and one-tap WhatsApp ordering.
- Dynamic **"You May Also Like"** related products grid filtered by category.

### 2. Live Master Pricing Catalog
- Filterable interactive table containing all 79 subscription tiers.
- Real-time instant search by service name or tier keyword.
- Filter by category: *Entertainment & OTT*, *AI & Productivity*, *Creative & Design*, *Education*, *Social & Gaming*.
- One-click instant order triggers directing straight to WhatsApp with pre-filled plan details.

### 3. Integrated WhatsApp & Local Payment Engine
- Automated message payload generator formatting:
  ```text
  Hello DigitalSubShop! 🎬
  I want to order:
  *Service:* <Product Name>
  *Plan:* <Selected Duration / Plan>
  *Price:* ৳<Price BDT>
  *Payment Method:* <bKash / Nagad / Rocket>
  *My Phone/Account:* <Customer Number>
  ```
- Built-in one-tap clipboard copy for the official merchant personal account (`01887924939`) with visual toast confirmation.

### 4. Custom Branding & Visual Identity
- **Logo Assets (`/images/logo.png`):** High-resolution transparent emblem featuring the iconic 'D' speed streak and digital subscription bag (Netflix, Spotify, Steam, Windows).
- **Responsive Favicons:** Multi-format cross-device support (`favicon.ico`, `favicon.png`, `favicon.svg`, `images/logo-192.png`, `images/logo-512.png`).
- **Social Sharing Banner (`/og-image.jpg`):** Custom 1376×768 Open Graph preview for Facebook, WhatsApp, Twitter, and LinkedIn links.

### 5. Production SEO & Structured Data
- Schema.org JSON-LD structured data on the homepage (`Organization`, `WebSite`).
- Dynamic Open Graph metadata, canonical tags, and `Product` / `Offer` microdata dynamically populated on `product.html`.
- Complete search engine files:
  - `sitemap.xml`: All 20 site URLs (homepage + all 19 product pages).
  - `robots.txt`: Search crawler indexing rules.

### 6. Zero-Dependency Static Architecture
- Pure vanilla HTML5, Tailwind CSS, and lightweight modern ES6 JavaScript.
- Ultra-fast load times (< 500ms First Contentful Paint).
- 100% self-hosted assets in `/images/products/` with zero external image CDN dependencies.

---

## 📂 Repository File Structure

```
digitalsubshop/
├── index.html              # Main storefront & 19 product cards catalog
├── product.html            # Dedicated full product details page
├── app.js                  # Global application engine & 79-tier pricing catalog
├── product.js              # Product page renderer, tabs & dynamic SEO injector
├── products_data.json      # Structured source-of-truth dataset (19 products)
├── price_chart.csv         # Full 79-tier raw pricing dataset
├── vercel.json             # Vercel routing rules & HTTP security headers
├── robots.txt              # Search engine crawler indexing directives
├── sitemap.xml             # XML sitemap covering all store routes
├── favicon.svg             # Vector favicon
├── favicon.png             # 64x64 PNG favicon
├── favicon.ico             # Standard browser favicon
├── og-image.jpg            # 1376x768 Open Graph social media banner
└── images/
    ├── logo.png            # Transparent brand logo
    ├── logo-192.png        # PWA app icon (192x192)
    ├── logo-512.png        # PWA app icon (512x512)
    └── products/           # 19 localized product cover images
```

---

## 🌐 Deployment & Hosting (Vercel)

The project includes an optimized `vercel.json` configured with:
- Clean URL rewrites (omits `.html` extensions).
- Production HTTP security headers:
  - `X-Frame-Options: SAMEORIGIN`
  - `X-Content-Type-Options: nosniff`
  - `X-XSS-Protection: 1; mode=block`
  - `Referrer-Policy: strict-origin-when-cross-origin`
- Cache-Control headers with immutable long-term caching for image assets.

### Connecting Custom Domain (`digitalsubshop.com`)
1. Import this repository in the [Vercel Dashboard](https://vercel.com).
2. Set Framework Preset to **Other** (Root directory: `./`).
3. Under **Settings > Domains**, add:
   - `digitalsubshop.com`
   - `www.digitalsubshop.com`
4. Set up DNS records with your domain registrar:
   | Type | Host / Name | Value / Points To |
   | :--- | :--- | :--- |
   | **A** | `@` | `76.76.21.21` |
   | **CNAME** | `www` | `cname.vercel-dns.com` |

---

## 📞 Support & Contacts
- **WhatsApp Support:** `+8801887924939`
- **Facebook Page:** [facebook.com/share/1F3zoLEESe](https://www.facebook.com/share/1F3zoLEESe/)
- **Delivery Guarantee:** 365-Day Escrow Replacement Warranty

---
*Client Delivery Document — Developed for DigitalSubShop.*
