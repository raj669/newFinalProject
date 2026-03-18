/* ── NepalEstates Client-Side JavaScript ─────────────────────────────────── */

const API = '/api/properties';

// ── Utility: format price in NPR (Crore / Lakh) ──────────────────────────
function formatNPR(amount) {
  if (amount >= 10_000_000) return `NPR ${(amount / 10_000_000).toFixed(2)} Cr`;
  if (amount >= 100_000)    return `NPR ${(amount / 100_000).toFixed(2)} Lakh`;
  return `NPR ${amount.toLocaleString()}`;
}

// ── Utility: capitalise first letter ─────────────────────────────────────
function cap(str) { return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''; }

// ── Render a single property card HTML string ─────────────────────────────
function renderCard(p) {
  const statusClass = p.status === 'sale' ? 'badge-sale' : 'badge-rent';
  const statusLabel = p.status === 'sale' ? 'Buy' : 'Rent';
  const img = p.images && p.images[0]
    ? `<img class="card-img" src="${p.images[0]}" alt="${p.title}" loading="lazy" />`
    : `<div class="card-img-placeholder">🏠</div>`;

  return `
    <a class="card" href="/property.html?id=${p.id}">
      ${img}
      <div class="card-body">
        <div class="card-badges">
          <span class="badge badge-type">${cap(p.type)}</span>
          <span class="badge ${statusClass}">${statusLabel}</span>
          ${p.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
        </div>
        <h3 class="card-title">${p.title}</h3>
        <p class="card-location">📍 ${p.city}, ${p.district}</p>
        <p class="card-price">${formatNPR(p.price)}${p.status === 'rent' ? '/mo' : ''}</p>
        <div class="card-meta">
          ${p.bedrooms > 0 ? `<span>🛏 ${p.bedrooms} bd</span>` : ''}
          ${p.bathrooms > 0 ? `<span>🚿 ${p.bathrooms} ba</span>` : ''}
          <span>📐 ${p.area} ${p.areaUnit}</span>
        </div>
      </div>
    </a>`;
}

// ── Load featured properties (home page) ─────────────────────────────────
async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  try {
    const res  = await fetch(`${API}/featured`);
    const data = await res.json();
    grid.innerHTML = data.length
      ? data.map(renderCard).join('')
      : '<p class="empty-state">No featured listings at the moment.</p>';
  } catch {
    grid.innerHTML = '<p class="empty-state">Unable to load featured listings.</p>';
  }
}

// ── Hero search form (home page) ──────────────────────────────────────────
function handleHeroSearch(e) {
  e.preventDefault();
  const fd     = new FormData(e.target);
  const params = new URLSearchParams();
  for (const [k, v] of fd.entries()) { if (v) params.set(k, v); }
  window.location.href = `/properties.html?${params.toString()}`;
}

// ── Load & filter properties (properties.html) ───────────────────────────
async function loadProperties() {
  const grid     = document.getElementById('propertiesGrid');
  const countEl  = document.getElementById('resultsCount');
  if (!grid) return;

  // Read current URL params
  const params = new URLSearchParams(window.location.search);

  // Populate filter form from URL
  const form = document.getElementById('filterForm');
  if (form) {
    for (const [k, v] of params.entries()) {
      const el = form.elements[k];
      if (el) el.value = v;
    }
  }

  grid.innerHTML = '<div class="spinner"></div>';

  try {
    const res  = await fetch(`${API}?${params.toString()}`);
    const data = await res.json();

    if (countEl) countEl.textContent = `Showing ${data.length} propert${data.length === 1 ? 'y' : 'ies'}`;

    grid.innerHTML = data.length
      ? data.map(renderCard).join('')
      : `<div class="empty-state"><div class="icon">🔍</div><p>No properties match your search. Try different filters.</p></div>`;
  } catch {
    grid.innerHTML = '<div class="empty-state"><p>Unable to load properties. Please try again.</p></div>';
  }
}

// ── Handle filter form submit (properties.html) ───────────────────────────
function handleFilter(e) {
  e.preventDefault();
  const fd     = new FormData(e.target);
  const params = new URLSearchParams();
  for (const [k, v] of fd.entries()) { if (v) params.set(k, v); }
  window.history.replaceState(null, '', `?${params.toString()}`);
  loadProperties();
}

// ── Load single property detail (property.html) ───────────────────────────
async function loadPropertyDetail() {
  const id   = new URLSearchParams(window.location.search).get('id');
  const main = document.getElementById('propertyDetail');
  if (!main || !id) return;

  try {
    const res = await fetch(`${API}/${id}`);
    if (!res.ok) throw new Error(res.status);
    const p   = await res.json();

    const statusClass = p.status === 'sale' ? 'badge-sale' : 'badge-rent';
    const statusLabel = p.status === 'sale' ? 'For Sale' : 'For Rent';
    const img = p.images && p.images[0]
      ? `<img class="property-detail-img" src="${p.images[0]}" alt="${p.title}" />`
      : `<div class="card-img-placeholder" style="height:350px;border-radius:10px">🏠</div>`;

    document.title = `${p.title} — NepalEstates`;

    main.innerHTML = `
      ${img}
      <h1 style="font-size:1.6rem;font-weight:700;color:#0f172a;margin-bottom:.5rem">${p.title}</h1>
      <p style="color:#64748b;margin-bottom:.5rem">📍 ${p.address}, ${p.city}, ${p.district}</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem">
        <span class="badge badge-type">${cap(p.type)}</span>
        <span class="badge ${statusClass}">${statusLabel}</span>
        ${p.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
      </div>
      <p style="font-size:1.8rem;font-weight:700;color:#dc2626;margin-bottom:1.5rem">
        ${formatNPR(p.price)}${p.status === 'rent' ? '<span style="font-size:1rem;color:#64748b"> /month</span>' : ''}
      </p>
      <div class="property-attrs">
        ${p.bedrooms > 0 ? `<div class="attr-item"><span class="attr-label">Bedrooms</span><span class="attr-value">🛏 ${p.bedrooms}</span></div>` : ''}
        ${p.bathrooms > 0 ? `<div class="attr-item"><span class="attr-label">Bathrooms</span><span class="attr-value">🚿 ${p.bathrooms}</span></div>` : ''}
        <div class="attr-item"><span class="attr-label">Area</span><span class="attr-value">📐 ${p.area} ${p.areaUnit}</span></div>
        <div class="attr-item"><span class="attr-label">City</span><span class="attr-value">🏙 ${p.city}</span></div>
        <div class="attr-item"><span class="attr-label">District</span><span class="attr-value">${p.district}</span></div>
        <div class="attr-item"><span class="attr-label">Listed</span><span class="attr-value">${p.listedDate}</span></div>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Description</h3>
      <p style="color:#374151;line-height:1.7">${p.description}</p>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Features</h3>
      <div class="features-list">
        ${(p.features || []).map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Contact Agent</h3>
      <a href="tel:${p.contact}" class="btn btn-primary" style="display:inline-block">📞 ${p.contact}</a>
      <a href="/contact.html" class="btn btn-outline" style="display:inline-block;margin-left:.8rem">Send Inquiry</a>
    `;
  } catch {
    main.innerHTML = '<div class="empty-state"><div class="icon">❌</div><p>Property not found.</p></div>';
  }
}

// ── Contact form submission ───────────────────────────────────────────────
function handleContactSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('[type=submit]');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    e.target.reset();
    btn.textContent = 'Submit';
    btn.disabled = false;
    alert('Thank you! Your inquiry has been received. Our team will contact you shortly.');
  }, 800);
}
