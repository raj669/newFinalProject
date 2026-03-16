/* =========================================================
   Nepal Real Estate – Shared Utilities
   ========================================================= */

'use strict';

// ---- Currency ----
function formatNPR(amount) {
  if (amount >= 10000000) {
    return 'NPR ' + (amount / 10000000).toFixed(2) + ' Cr';
  }
  if (amount >= 100000) {
    return 'NPR ' + (amount / 100000).toFixed(2) + ' L';
  }
  return 'NPR ' + amount.toLocaleString('en-NP');
}

// ---- Property images by type ----
const TYPE_IMAGES = {
  apartment: [
    'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=500&fit=crop', // Interior flat
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop', // Modern apartment decor
    'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&h=500&fit=crop', // Condo building
    'https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&h=500&fit=crop', // Bright interior
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop', // Studio bedroom
  ],
  house: [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=500&fit=crop', // Cozy house
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop', // Large home
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=500&fit=crop', // Colonial style
    'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&h=500&fit=crop', // Traditional brick
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=500&fit=crop', // Single story
  ],
  villa: [
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=500&fit=crop', // Premium villa
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=500&fit=crop', // Minimalist villa
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=500&fit=crop', // Villa with pool
    'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=500&fit=crop', // Large Home/Villa
    'https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?w=800&h=500&fit=crop', // Mountain villa
  ],
  commercial: [
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=500&fit=crop', // Office interior
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', // Co-working space
    'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&h=500&fit=crop', // Shop front
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&h=500&fit=crop', // Warehouse/Industrial
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=500&fit=crop', // Restaurant space
    'https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&h=500&fit=crop', // Store
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop', // Desk/office
  ],
  land: [
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&h=500&fit=crop',
    'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&h=500&fit=crop', // Agricultural field
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&h=500&fit=crop', // Lush green
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop', // Mountain/Nature
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&h=500&fit=crop', // Hilltop land
    'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&h=500&fit=crop', // Tea garden vibes
  ],
};

function getPropertyImage(p) {
  // Hardcoded bypass for Dharan land to ensure contextually accurate imagery
  if (p.id === 13) {
    return 'https://images.unsplash.com/photo-1560942485-b2a11cc13456?w=800&h=500&fit=crop';
  } else if (p.id === 22) {
    return 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&h=500&fit=crop';
  }
  
  const imgs = TYPE_IMAGES[p.type] || TYPE_IMAGES.apartment;
  return imgs[p.id % imgs.length];
}

// ---- Property type emoji (used on detail page) ----
const TYPE_EMOJI = { apartment:'🏢', house:'🏠', villa:'🏡', commercial:'🏪', land:'🌿' };
function getTypeEmoji(type) { return TYPE_EMOJI[type] || '🏠'; }

// ---- Render property card HTML ----
function renderPropertyCard(p) {
  const emoji = getTypeEmoji(p.type);
  const bgColors = {
    apartment:  'linear-gradient(135deg,#667eea,#764ba2)',
    house:      'linear-gradient(135deg,#f093fb,#f5576c)',
    villa:      'linear-gradient(135deg,#4facfe,#00f2fe)',
    commercial: 'linear-gradient(135deg,#43e97b,#38f9d7)',
    land:       'linear-gradient(135deg,#fa709a,#fee140)',
  };
  const bg  = bgColors[p.type] || bgColors.apartment;
  const img = getPropertyImage(p);

  const featuredBadge = p.featured
    ? '<span class="badge badge-featured">Featured</span>'
    : '';
  const statusBadge = `<span class="badge badge-${p.status}">${p.status === 'sale' ? 'For Sale' : 'For Rent'}</span>`;

  const areaText     = p.area > 0 ? `${p.area} ${p.areaUnit}` : 'N/A';
  const bedroomsText = p.bedrooms > 0 ? `🛏 ${p.bedrooms} Bed` : '';
  const bathroomsText= p.bathrooms > 0 ? `🚿 ${p.bathrooms} Bath` : '';

  const priceLabel = p.status === 'rent' ? `${formatNPR(p.price)}/mo` : formatNPR(p.price);

  return `
    <div class="property-card" onclick="location.href='property.html?id=${p.id}'">
      <div class="property-card-img" style="background:${bg}">
        <img src="${img}" alt="${escapeHtml(p.title)}"
             style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;"
             onerror="this.style.display='none'" loading="lazy" />
        <div class="badges">${featuredBadge}${statusBadge}</div>
      </div>
      <div class="property-card-body">
        <div class="property-card-title">${escapeHtml(p.title)}</div>
        <div class="property-card-address">📍 ${escapeHtml(p.address)}</div>
        <div class="property-card-price">${priceLabel}</div>
        <div class="property-meta">
          ${bedroomsText ? `<span>${bedroomsText}</span>` : ''}
          ${bathroomsText ? `<span>${bathroomsText}</span>` : ''}
          <span>📐 ${areaText}</span>
          <span>🏙 ${escapeHtml(p.city)}</span>
        </div>
      </div>
    </div>
  `;
}


// ---- Simple HTML escape ----
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ---- Fetch wrapper ----
async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---- Active nav link ----
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ---- Mobile nav toggle ----
function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setActiveNav();
  initNavToggle();
});
