// DigitalSubShop - Individual Product Page Engine (DigitalSubShop style)
'use strict';

var WHATSAPP_PHONE = window.WHATSAPP_PHONE || '8801887924939';
const FB_PAGE_URL = 'https://www.facebook.com/share/1F3zoLEESe/';

let pCurrentVariation = null;
let pCurrentPaymentMethod = 'bKash';
let pProduct = null;

// ---------- helpers ----------
function fixMojibake(s) {
  if (!s) return '';
  return String(s)
    .replace(/â€™/g, "'").replace(/â€œ/g, '"').replace(/â€\u009d/g, '"')
    .replace(/â€“/g, '–').replace(/â€¢/g, '•').replace(/Â /g, ' ')
    .replace('[provided site]', 'DigitalSubShop')
    .replace(/primeaccessbd\.com/g, 'digitalsubshop.com')
    .replace(/PrimeAccessBD/g, 'DigitalSubShop')
    .replace(/prime access bd/gi, 'digital sub shop');
}
function cleanHtml(html) {
  let t = fixMojibake(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|h[1-6]|tr)>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&rsquo;|&#8217;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();
  return t;
}
function renderRichText(container, text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let html = '', listOpen = false;
  lines.forEach(line => {
    if (line.startsWith('•')) {
      if (!listOpen) { html += '<ul>'; listOpen = true; }
      html += `<li>${line.replace(/^•\s*/, '')}</li>`;
    } else {
      if (listOpen) { html += '</ul>'; listOpen = false; }
      if (line.length <= 42 && !line.endsWith('.')) {
        html += `<h4>${line}</h4>`;
      } else {
        html += `<p>${line}</p>`;
      }
    }
  });
  if (listOpen) html += '</ul>';
  container.innerHTML = html || '<p>Standard license delivery.</p>';
}
function getProductPricing(p) {
  if (p.variations && p.variations.length) {
    const prices = p.variations.map(v => v.price).filter(x => x !== null && x !== undefined);
    const regs = p.variations.map(v => v.regular_price).filter(x => x !== null && x !== undefined);
    return { min: Math.min(...prices), max: Math.max(...prices), reg: regs.length ? Math.max(...regs) : null };
  }
  const rp = p.raw_prices || {};
  const minor = (rp.currency_minor_unit === undefined || rp.currency_minor_unit === null) ? 2 : rp.currency_minor_unit;
  const div = Math.pow(10, minor);
  const price = rp.price ? Number(rp.price) / div : null;
  const reg = rp.regular_price ? Number(rp.regular_price) / div : null;
  return { min: price, max: price, reg: reg };
}
const DELIVERY_HTML = `<h4>Delivery Process</h4>
<p>Standard delivery time is 1–12 hours after successful payment. Credentials or invitation links are sent directly to your account, email, or order receipt — no registration required.</p>
<h4>Warranty & Replacement</h4>
<p>Every order is covered by our 365-day replacement warranty. If your subscription stops working during the term, a replacement profile slot or invitation is re-issued within minutes.</p>
<h4>Important Notes</h4>
<ul><li>Subscription supports single-device/account login to maintain security.</li><li>Account modification is restricted to keep service validity.</li><li>Refunds or replacements are not applicable for suspicious activity or T&C violations.</li></ul>`;
const WHY_HTML = `<h4>Why Buy from DigitalSubShop?</h4>
<ul><li>100% genuine and authentic subscription guarantee.</li><li>Fastest delivery directly to your account.</li><li>Convenient local payment methods including bKash, Nagad, Rocket, and Upay.</li><li>Dedicated 24/7 local customer support on WhatsApp, Messenger and phone.</li><li>Lowest price guarantee in Bangladesh for premium subscriptions.</li></ul>`;
/**
 * Update SEO meta tags and title based on product data
 */
function updateSEO(product) {
  console.log('updateSEO called for:', product?.name);
  if (!product) return;
  // Update document title
  document.title = `${product.name} — DigitalSubShop`;
  // Update meta description (use short_description or description)
  const descEl = document.getElementById('meta-description');
  if (descEl) {
    const desc = product.short_description || product.description || '';
    descEl.content = cleanHtml(desc).substring(0, 160); // limit length
  }
  // Update OG title
  const ogTitleEl = document.getElementById('og-title');
  if (ogTitleEl) ogTitleEl.content = `${product.name} — DigitalSubShop`;
  // Update OG description
  const ogDescEl = document.getElementById('og-description');
  if (ogDescEl) {
    const desc = product.short_description || product.description || '';
    ogDescEl.content = cleanHtml(desc).substring(0, 200);
  }
  // Update OG image
  const ogImgEl = document.getElementById('og-image');
  if (ogImgEl) {
    const img = (product.images && product.images[0]) ? product.images[0] : 'https://www.digitalsubshop.com/og-image.jpg';
    ogImgEl.content = img;
  }
  // Update OG URL (include product id)
  const ogUrlEl = document.getElementById('og-url');
  if (ogUrlEl) {
    const id = product.id ? product.id : '';
    ogUrlEl.content = `https://www.digitalsubshop.com/product?id=${id}`;
  }
  // Update Twitter title
  const twTitleEl = document.getElementById('twitter-title');
  if (twTitleEl) twTitleEl.content = `${product.name} — DigitalSubShop`;
  // Update Twitter description
  const twDescEl = document.getElementById('twitter-description');
  if (twDescEl) {
    const desc = product.short_description || product.description || '';
    twDescEl.content = cleanHtml(desc).substring(0, 200);
  }
  // Update Twitter image
  const twImgEl = document.getElementById('twitter-image');
  if (twImgEl) {
    const img = (product.images && product.images[0]) ? product.images[0] : 'https://www.digitalsubshop.com/og-image.jpg';
    twImgEl.content = img;
  }
  // Update canonical URL
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl && product.id) {
    canonicalEl.href = `https://www.digitalsubshop.com/product?id=${product.id}`;
  }
  // Inject or update Schema.org Product JSON-LD
  let scriptEl = document.getElementById('product-schema-ld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'product-schema-ld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }
  const pricing = getProductPricing(product);
  const pImg = (product.images && product.images[0]) 
    ? (product.images[0].startsWith('http') ? product.images[0] : `https://www.digitalsubshop.com/${product.images[0]}`)
    : 'https://www.digitalsubshop.com/og-image.jpg';
  scriptEl.textContent = JSON.stringify({
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": pImg,
    "description": cleanHtml(product.short_description || product.description).substring(0, 300),
    "brand": {
      "@type": "Brand",
      "name": "DigitalSubShop"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.digitalsubshop.com/product?id=${product.id}`,
      "priceCurrency": "BDT",
      "price": pricing.min || 0,
      "availability": product.is_in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    }
  });

  // Breadcrumb structured data (SEO)
  let bcEl = document.getElementById('breadcrumb-ld');
  if (!bcEl) {
    bcEl = document.createElement('script');
    bcEl.id = 'breadcrumb-ld';
    bcEl.type = 'application/ld+json';
    document.head.appendChild(bcEl);
  }
  bcEl.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.digitalsubshop.com/" },
      { "@type": "ListItem", "position": 2, "name": "Catalog", "item": "https://www.digitalsubshop.com/#catalog" },
      { "@type": "ListItem", "position": 3, "name": product.name, "item": "https://www.digitalsubshop.com/product?id=" + product.id }
    ]
  });
}
window.updateSEO = updateSEO;

function setTab2(tab, btn) {
  document.querySelectorAll('.tab-btn2').forEach(b => {
    b.classList.remove('active', 'bg-primary-container', 'text-white', 'shadow-[0_0_12px_rgba(0,102,255,0.35)]');
    b.classList.add('glass-pill', 'text-on-surface-variant');
  });
  btn.classList.add('active', 'bg-primary-container', 'text-white', 'shadow-[0_0_12px_rgba(0,102,255,0.35)]');
  btn.classList.remove('glass-pill', 'text-on-surface-variant');
  const c = document.getElementById('tabContent');
  if (tab === 'desc') {
    renderRichText(c, cleanHtml(pProduct.description || pProduct.short_description));
  } else if (tab === 'delivery') {
    c.innerHTML = DELIVERY_HTML;
  } else {
    c.innerHTML = WHY_HTML;
  }
}
window.setTab2 = setTab2;
// ---------- main render ----------
function findProduct() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const slug = params.get('slug');
  if (id) return PRODUCTS_DATA.find(p => String(p.id) === String(id)) || null;
  if (slug) return PRODUCTS_DATA.find(p => p.slug === slug) || null;
  return PRODUCTS_DATA[0] || null;
}

function updateSummary() {
  const summaryPrice = document.getElementById('pSummaryPrice');
  const summaryPlan = document.getElementById('pSummaryPlan');
  const pPrice = document.getElementById('pPrice');
  const pRegPrice = document.getElementById('pRegPrice');
  const pSaveBadge = document.getElementById('pSaveBadge');
  if (!pCurrentVariation) return;
  const sale = pCurrentVariation.price !== null ? `৳${pCurrentVariation.price.toLocaleString()}` : '৳0';
  const reg = pCurrentVariation.regular_price ? `৳${pCurrentVariation.regular_price.toLocaleString()}` : '';
  const save = (pCurrentVariation.regular_price && pCurrentVariation.regular_price > pCurrentVariation.price)
    ? `Save ৳${(pCurrentVariation.regular_price - pCurrentVariation.price).toLocaleString()}` : '';
  if (summaryPrice) summaryPrice.innerText = sale;
  if (summaryPlan) summaryPlan.innerText = `${pProduct.name} • ${pCurrentVariation.option}`;
  if (pPrice) pPrice.innerText = sale;
  if (pRegPrice) pRegPrice.innerText = reg;
  if (pSaveBadge) pSaveBadge.innerText = save;
}
window.updateSummary = updateSummary;

function renderVariations() {
  const list = document.getElementById('pVariationsList');
  if (!list) return;
  if (!pProduct.variations || !pProduct.variations.length) {
    list.innerHTML = '<div class="text-sm text-outline p-4 text-center">Standard license delivery.</div>';
    pCurrentVariation = { option: 'Standard', price: getProductPricing(pProduct).min, regular_price: getProductPricing(pProduct).reg };
    updateSummary();
    return;
  }
  pCurrentVariation = pProduct.variations[0];
  list.innerHTML = pProduct.variations.map((v, i) => {
    const isSelected = i === 0;
    const saleP = v.price !== null ? `৳${v.price.toLocaleString()}` : '৳0';
    const regP = v.regular_price ? `৳${v.regular_price.toLocaleString()}` : '';
    const saveP = (v.regular_price && v.regular_price > v.price) ? `Save ৳${v.regular_price - v.price}` : '';
    return `
      <div class="variation-option-card flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${isSelected ? 'border-primary-container bg-primary-container/15 text-white shadow-[0_0_16px_rgba(0,102,255,0.35)]' : 'border-white/10 bg-white/[0.04] text-on-surface-variant'}" data-vi="${i}">
        <div class="flex items-center gap-3">
          <div class="w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-primary-container' : 'border-outline'}">
            <div class="w-2 h-2 rounded-full ${isSelected ? 'bg-primary-container' : 'bg-transparent'}"></div>
          </div>
          <div>
            <div class="text-sm font-semibold text-white">${v.option}</div>
            <div class="text-[11px] text-tertiary">${v.is_in_stock ? 'In Stock (Instant Dispatch)' : 'Out of Stock'}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-base font-bold font-display text-white">${saleP}</div>
          ${regP ? `<div class="text-[11px] text-outline line-through">${regP}</div>` : ''}
          ${saveP ? `<span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">${saveP}</span>` : ''}
        </div>
      </div>`;
  }).join('');
  list.querySelectorAll('.variation-option-card').forEach(card => {
    card.addEventListener('click', () => {
      pCurrentVariation = pProduct.variations[Number(card.dataset.vi)];
      list.querySelectorAll('.variation-option-card').forEach(c => {
        c.classList.remove('border-primary-container', 'bg-primary-container/15', 'text-white', 'shadow-[0_0_16px_rgba(0,102,255,0.35)]');
        c.classList.add('border-white/10', 'bg-white/[0.04]', 'text-on-surface-variant');
        const dotOuter = c.querySelector('.w-4'); if (dotOuter) { dotOuter.classList.remove('border-primary-container'); dotOuter.classList.add('border-outline'); }
        const dotInner = c.querySelector('.w-4 .w-2'); if (dotInner) { dotInner.classList.remove('bg-primary-container'); dotInner.classList.add('bg-transparent'); }
      });
      card.classList.add('border-primary-container', 'bg-primary-container/15', 'text-white', 'shadow-[0_0_16px_rgba(0,102,255,0.35)]');
      card.classList.remove('border-white/10', 'bg-white/[0.04]', 'text-on-surface-variant');
      const dotOuter = card.querySelector('.w-4'); if (dotOuter) { dotOuter.classList.remove('border-outline'); dotOuter.classList.add('border-primary-container'); }
      const dotInner = card.querySelector('.w-4 .w-2'); if (dotInner) { dotInner.classList.remove('bg-transparent'); dotInner.classList.add('bg-primary-container'); }
      updateSummary();
    });
  });
  updateSummary();
}
function setPaymentMethod(method, btn) {
  pCurrentPaymentMethod = method;
  document.querySelectorAll('.pay-method-btn').forEach(b => {
    b.classList.remove('border-primary-container', 'bg-primary-container/20', 'text-white');
    b.classList.add('border-white/10', 'bg-white/[0.03]', 'text-on-surface-variant');
  });
  btn.classList.add('border-primary-container', 'bg-primary-container/20', 'text-white');
  btn.classList.remove('border-white/10', 'bg-white/[0.03]', 'text-on-surface-variant');
}
window.setPaymentMethod = setPaymentMethod;

function sendWhatsAppOrder() {
  if (!pProduct || !pCurrentVariation) return;
  const phoneInput = document.getElementById('customerPhone');
  const customerPhone = phoneInput ? phoneInput.value.trim() : '';
  const price = pCurrentVariation.price !== null ? `৳${pCurrentVariation.price}` : 'Contact Us';
  const text = `Hello DigitalSubShop! 🎬\n\nI want to order:\n*Service:* ${pProduct.name}\n*Plan:* ${pCurrentVariation.option}\n*Price:* ${price}\n*Payment Method:* ${pCurrentPaymentMethod}${customerPhone ? `\n*My Phone/Account:* ${customerPhone}` : ''}\n\nPlease confirm my order. Thank you!`;
  window.open(`https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`, '_blank');
}
window.sendWhatsAppOrder = sendWhatsAppOrder;

function renderRelated() {
  const grid = document.getElementById('relatedGrid');
  if (!grid || !pProduct) return;
  const myCat = (pProduct.categories && pProduct.categories[0] ? pProduct.categories[0] : '').toLowerCase();
  const related = PRODUCTS_DATA.filter(p => {
    if (String(p.id) === String(pProduct.id)) return false;
    const c = (p.categories && p.categories[0] ? p.categories[0] : '').toLowerCase();
    if (myCat && c === myCat) return true;
    return !myCat && c !== '';
  }).slice(0, 4);
  grid.innerHTML = related.map(p => {
    const pr = getProductPricing(p);
    const img = (p.images && p.images[0]) ? p.images[0] : '';
    const cat = (p.categories && p.categories[0]) || 'Digital';
    return `
      <div class="product-item glass-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:border-primary-container/40 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(0,102,255,0.22)]" onclick="openProductPage(${p.id})">
        <div class="relative h-28 sm:h-44 overflow-hidden bg-surface-container">
          ${img ? `<img src="${img}" alt="${p.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />` : ''}
          <div class="absolute inset-0 bg-gradient-to-t from-[#0e121a] via-[#0e121a]/40 to-transparent"></div>
          <div class="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold bg-black/60 text-white/90 backdrop-blur border border-white/10">
            ${cat}
          </div>
          <div class="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div class="bg-black/60 backdrop-blur-md rounded-full w-9 h-9 flex items-center justify-center border border-white/20 shadow-xl">
              <span class="material-symbols-outlined text-white text-sm">arrow_forward</span>
            </div>
          </div>
        </div>
        <div class="p-3 sm:p-5 flex flex-col flex-grow justify-between">
          <div>
            <h3 class="font-display font-bold text-white text-xs sm:text-base leading-tight group-hover:text-primary-container transition-colors line-clamp-1 sm:line-clamp-none">${p.name}</h3>
            <p class="text-[11px] sm:text-xs text-on-surface-variant mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">${cleanHtml(p.short_description || p.description).substring(0, 85)}...</p>
          </div>
          <div class="mt-3 sm:mt-4 pt-2.5 sm:pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-1">
            <div>
              <span class="text-[9px] sm:text-[10px] text-outline line-through block leading-none">${pr.reg && pr.reg > pr.min ? `৳${pr.reg.toLocaleString()}` : ''}</span>
              <div class="text-xs sm:text-lg font-display font-bold text-white leading-tight">${pr.min !== null ? `৳${pr.min.toLocaleString()}` : '৳0'} <span class="text-[9px] sm:text-xs font-normal text-on-surface-variant">/plan</span></div>
            </div>
            <span class="px-2 sm:px-3 py-1.5 rounded-lg sm:rounded-xl bg-primary-container text-on-primary-container font-bold text-[10px] sm:text-xs uppercase tracking-wider flex items-center gap-0.5 hover:brightness-110 shrink-0">
              <span class="material-symbols-outlined text-[12px] sm:text-[13px]">bolt</span>
              <span>View</span>
            </span>
          </div>
        </div>
      </div>`;
  }).join('');
}

function initProductPage() {
  pProduct = findProduct();
  if (!pProduct) {
    const titleEl = document.getElementById('pTitle');
    if (titleEl) titleEl.innerText = 'Product not found';
    return;
  }
  
  // Clean product data to replace any references to old brand
  pProduct = cleanProductData(pProduct);
  updateSEO(pProduct);
  
  document.title = `${pProduct.name} — DigitalSubShop`;
  const bcProduct = document.getElementById('bcProduct');
  const bcCategory = document.getElementById('bcCategory');
  if (bcProduct) bcProduct.innerText = pProduct.name;
  if (bcCategory && pProduct.categories && pProduct.categories[0]) bcCategory.innerText = pProduct.categories[0];

  const cat = document.getElementById('pCategory');
  if (cat) cat.innerText = (pProduct.categories && pProduct.categories[0]) || 'Digital';

  const catBox = document.getElementById('pCategoryBox');
  if (catBox) catBox.innerText = (pProduct.categories && pProduct.categories[0]) || 'Digital';

  const pTitle = document.getElementById('pTitle');
  if (pTitle) pTitle.innerText = pProduct.name;

  const pTitleBox = document.getElementById('pTitleBox');
  if (pTitleBox) pTitleBox.innerText = pProduct.name;

  const pHeroDesc = document.getElementById('pHeroDesc');
  if (pHeroDesc) {
    const rawDesc = pProduct.short_description || pProduct.description || '';
    pHeroDesc.innerText = cleanHtml(rawDesc).substring(0, 180) + '...';
  }

  const badge = document.getElementById('pStockBadge');
  if (badge) {
    if (pProduct.is_in_stock === false) {
      badge.className = 'absolute bottom-3 left-3 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[11px] font-semibold backdrop-blur border border-red-500/30';
      badge.innerText = 'Out of Stock';
    } else {
      badge.className = 'absolute bottom-3 left-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-semibold backdrop-blur border border-emerald-500/30';
      badge.innerText = 'In Stock (Instant Dispatch)';
    }
  }

  const img = document.getElementById('pImage');
  const heroBackdrop = document.getElementById('pHeroBackdrop');
  const fb = document.getElementById('pImageFallback');
  const letter = document.getElementById('pImageLetter');
  if (letter) letter.innerText = pProduct.name.charAt(0);
  
  const src = (pProduct.images && pProduct.images[0]) ? pProduct.images[0] : '';
  if (src) {
    if (img) {
      img.src = src;
      img.onerror = () => { img.style.display = 'none'; if (fb) fb.classList.remove('hidden'); };
    }
    if (heroBackdrop) {
      heroBackdrop.src = src;
    }
  } else {
    if (img) img.style.display = 'none';
    if (fb) fb.classList.remove('hidden');
  }

  renderVariations();
  const descTab = document.querySelector('.tab-btn2[data-tab="desc"]');
  if (descTab) setTab2('desc', descTab);
  renderRelated();
}

// Clean product data to replace any references to old branding
function cleanProductData(product) {
  if (!product) return product;
  
  // Create a copy to avoid modifying original data
  const cleaned = { ...product };
  
  // Clean string fields
  if (cleaned.name) cleaned.name = fixMojibake(cleaned.name);
  if (cleaned.short_description) cleaned.short_description = fixMojibake(cleaned.short_description);
  if (cleaned.description) cleaned.description = fixMojibake(cleaned.description);
  if (cleaned.slug) cleaned.slug = fixMojibake(cleaned.slug);
  
  // Clean categories if needed
  if (cleaned.categories && Array.isArray(cleaned.categories)) {
    cleaned.categories = cleaned.categories.map(category => fixMojibake(category));
  }
  
  // Clean variations if needed
  if (cleaned.variations && Array.isArray(cleaned.variations)) {
    cleaned.variations = cleaned.variations.map(variation => {
      const cleanedVariation = { ...variation };
      if (cleanedVariation.option) cleanedVariation.option = fixMojibake(cleanedVariation.option);
      // Note: variation.attributes is an object that likely doesn't need cleaning based on observed data
      return cleanedVariation;
    });
  }
  
  // Clean permalink if needed (though we don't display it prominently)
  if (cleaned.permalink) cleaned.permalink = cleaned.permalink.replace(/primeaccessbd\.com/g, 'digitalsubshop.com');
  
  // Clean image URLs (keep valid local/remote URLs)
  if (cleaned.images && Array.isArray(cleaned.images)) {
    cleaned.images = cleaned.images.map(img => img);
  }
  
  // Clean tags if needed
  if (cleaned.tags && Array.isArray(cleaned.tags)) {
    cleaned.tags = cleaned.tags.map(tag => fixMojibake(tag));
  }
  
  return cleaned;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductPage);
} else {
  initProductPage();
}
