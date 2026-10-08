# DigitalSubShop.com 🚀

> Premium Digital Subscriptions & Licenses Marketplace (Optimized for Bangladesh)

Live Domain: **[https://digitalsubshop.com](https://digitalsubshop.com)**

---

## 🌟 Overview
**DigitalSubShop** is a high-performance, dark-neon themed digital commerce storefront tailored for instant delivery of streaming services, frontier AI tools, creative software, and gaming subscriptions.

### Featured Services (19 Products, 79 Plan Options):
* **Streaming & OTT:** Netflix UHD 4K, Amazon Prime Video, YouTube Premium, Crunchyroll Mega Fan, Kuku TV, Ullu.
* **AI & Productivity:** ChatGPT Pro (o1 Pro compute), Google Gemini Pro (2M context), SuperGrok, Quizlet Plus, vidIQ Boost.
* **Design & Creative:** Adobe Creative Cloud (20+ Apps), Canva Pro, Envato Elements, CapCut Pro, Freepik Premium.
* **Gaming & Social Media:** TikTok Coins, Facebook Page Likes & Followers, Clash of Clans Gold Pass.

---

## ⚡ Key Architecture & Fixes Applied

1. **Vercel-Ready Deployment (`vercel.json`):**
   * Configured clean URLs without `.html` extensions.
   * Hardened HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `X-XSS-Protection`, `Referrer-Policy`).
   * Long-term immutable caching for `/images/*` assets.
2. **Local Asset Self-Hosting:**
   * All 19 product image assets are stored locally in `/images/products/` with zero third-party hotlinking dependencies.
3. **SEO & Social Optimization:**
   * High-resolution Open Graph banner (`/og-image.jpg`) for WhatsApp, Messenger, Facebook, and Twitter rich links.
   * Branded cyber SVG badge (`/favicon.svg`).
   * Schema.org JSON-LD structured data for Google Search rich cards.
   * Auto-generated `sitemap.xml` and `robots.txt`.
4. **Seamless E-Commerce UX:**
   * **Homepage Quick Checkout:** Clicking "Claim Slot" opens a responsive modal with duration options, real-time BDT calculations, bKash/Nagad/Rocket account copying, and 1-tap WhatsApp order dispatch.
   * **Dedicated Detail Pages:** Clicking any product title directs to `/product.html?id=<id>` featuring comprehensive descriptions, license terms, warranty escrow details, and related recommendations.

---

## 🛠️ Deploying to Vercel with Custom Domain

### Option 1: Vercel Dashboard (Recommended)
1. Push this repository to GitHub: `https://github.com/BSC10840/DigitalSubShop`
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import the `DigitalSubShop` repository.
4. Keep Framework Preset as **Other** (Root directory: `./`), then click **Deploy**.
5. Once deployed, navigate to **Project Settings > Domains**.
6. Enter your domain: `digitalsubshop.com` and `www.digitalsubshop.com`.
7. Configure DNS records at your domain registrar:
   * **A Record:** `@` points to `76.76.21.21`
   * **CNAME Record:** `www` points to `cname.vercel-dns.com`

---

## 📄 License
© 2026 DigitalSubShop. All rights reserved.
