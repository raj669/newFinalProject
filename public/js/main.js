/* ── NepalEstates Client-Side JavaScript ─────────────────────────────────── */

const API = '/api/properties';

// Active Firestore unsubscribe handles (cleared on re-load)
let _unsubFeatured   = null;
let _unsubProperties = null;
let _unsubDetail     = null;

// ── Utility: escape HTML to prevent XSS ──────────────────────────────────
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
    ? `<img class="card-img" src="${esc(p.images[0])}" alt="${esc(p.title)}" loading="lazy" />`
    : `<div class="card-img-placeholder">🏠</div>`;

  return `
    <a class="card" href="/property.html?id=${p.id}">
      ${img}
      <div class="card-body">
        <div class="card-badges">
          <span class="badge badge-type">${esc(cap(p.type))}</span>
          <span class="badge ${statusClass}">${statusLabel}</span>
          ${p.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
        </div>
        <h3 class="card-title">${esc(p.title)}</h3>
        <p class="card-location">📍 ${esc(p.city)}, ${esc(p.district)}</p>
        <p class="card-price">${formatNPR(p.price)}${p.status === 'rent' ? '/mo' : ''}</p>
        <div class="card-meta">
          ${p.bedrooms > 0 ? `<span>🛏 ${esc(p.bedrooms)} bd</span>` : ''}
          ${p.bathrooms > 0 ? `<span>🚿 ${esc(p.bathrooms)} ba</span>` : ''}
          <span>📐 ${esc(p.area)} ${esc(p.areaUnit)}</span>
        </div>
      </div>
    </a>`;
}

// ── AbortController for in-flight loadProperties requests ────────────────
let _propertiesController = null;

// ── Load featured properties (home page) ─────────────────────────────────
async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;

  // Cancel any previous real-time listener
  if (_unsubFeatured) { _unsubFeatured(); _unsubFeatured = null; }

  function render(data) {
    grid.innerHTML = data && data.length
      ? data.map(renderCard).join('')
      : '<p class="empty-state">No featured listings at the moment.</p>';
  }

  // ── Firestore real-time path ──────────────────────────────────────────
  if (window.neListenProperties) {
    grid.innerHTML = '<div class="spinner"></div>';
    _unsubFeatured = window.neListenProperties({ featured: 'true' }, function (data) {
      if (data === null) {
        // Firestore error — fall back to REST
        _unsubFeatured = null;
        loadFeaturedREST(grid, render);
      } else {
        render(data);
      }
    });
    return;
  }

  // ── REST API fallback ─────────────────────────────────────────────────
  loadFeaturedREST(grid, render);
}

async function loadFeaturedREST(grid, render) {
  grid.innerHTML = '<div class="spinner"></div>';
  try {
    const res  = await fetch(`${API}/featured`);
    if (!res.ok) throw new Error(res.status);
    render(await res.json());
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
  const grid    = document.getElementById('propertiesGrid');
  const countEl = document.getElementById('resultsCount');
  if (!grid) return;

  // Cancel any previous real-time listener or in-flight request
  if (_unsubProperties) { _unsubProperties(); _unsubProperties = null; }
  if (_propertiesController) _propertiesController.abort();
  _propertiesController = new AbortController();

  // Read current URL params
  const params = new URLSearchParams(window.location.search);
  const filters = Object.fromEntries(params.entries());

  // Populate filter form from URL
  const form = document.getElementById('filterForm');
  if (form) {
    for (const [k, v] of params.entries()) {
      const el = form.elements[k];
      if (el) el.value = v;
    }
  }

  function render(data) {
    if (countEl) countEl.textContent = `Showing ${data.length} propert${data.length === 1 ? 'y' : 'ies'}`;
    grid.innerHTML = data.length
      ? data.map(renderCard).join('')
      : `<div class="empty-state"><div class="icon">🔍</div><p>No properties match your search. Try different filters.</p></div>`;
  }

  grid.innerHTML = '<div class="spinner"></div>';
  if (countEl) countEl.textContent = 'Loading…';

  // ── Firestore real-time path ──────────────────────────────────────────
  if (window.neListenProperties) {
    _unsubProperties = window.neListenProperties(filters, function (data) {
      if (data === null) {
        // Firestore error — fall back to REST
        _unsubProperties = null;
        loadPropertiesREST(grid, countEl, params, render);
      } else {
        render(data);
      }
    });
    return;
  }

  // ── REST API fallback ─────────────────────────────────────────────────
  loadPropertiesREST(grid, countEl, params, render);
}

async function loadPropertiesREST(grid, countEl, params, render) {
  try {
    const res  = await fetch(`${API}?${params.toString()}`, { signal: _propertiesController.signal });
    if (!res.ok) throw new Error(res.status);
    render(await res.json());
  } catch (err) {
    if (err.name === 'AbortError') return;
    if (countEl) countEl.textContent = '';
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
  if (!main) return;

  if (!id) {
    main.innerHTML = '<div class="empty-state"><div class="icon">❌</div><p>No property selected.</p></div>';
    return;
  }

  // Cancel any previous real-time listener
  if (_unsubDetail) { _unsubDetail(); _unsubDetail = null; }

  function render(p) {
    if (!p) {
      main.innerHTML = '<div class="empty-state"><div class="icon">❌</div><p>Property not found.</p></div>';
      return;
    }
    const statusClass = p.status === 'sale' ? 'badge-sale' : 'badge-rent';
    const statusLabel = p.status === 'sale' ? 'For Sale' : 'For Rent';
    const img = p.images && p.images[0]
      ? `<img class="property-detail-img" src="${esc(p.images[0])}" alt="${esc(p.title)}" />`
      : `<div class="card-img-placeholder" style="height:350px;border-radius:10px">🏠</div>`;

    document.title = `${p.title} — NepalEstates`;

    main.innerHTML = `
      ${img}
      <h1 style="font-size:1.6rem;font-weight:700;color:#0f172a;margin-bottom:.5rem">${esc(p.title)}</h1>
      <p style="color:#64748b;margin-bottom:.5rem">📍 ${esc(p.address)}, ${esc(p.city)}, ${esc(p.district)}</p>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;margin-bottom:1rem">
        <span class="badge badge-type">${esc(cap(p.type))}</span>
        <span class="badge ${statusClass}">${statusLabel}</span>
        ${p.featured ? '<span class="badge badge-featured">⭐ Featured</span>' : ''}
      </div>
      <p style="font-size:1.8rem;font-weight:700;color:#dc2626;margin-bottom:1.5rem">
        ${formatNPR(p.price)}${p.status === 'rent' ? '<span style="font-size:1rem;color:#64748b"> /month</span>' : ''}
      </p>
      <div class="property-attrs">
        ${p.bedrooms > 0 ? `<div class="attr-item"><span class="attr-label">Bedrooms</span><span class="attr-value">🛏 ${esc(p.bedrooms)}</span></div>` : ''}
        ${p.bathrooms > 0 ? `<div class="attr-item"><span class="attr-label">Bathrooms</span><span class="attr-value">🚿 ${esc(p.bathrooms)}</span></div>` : ''}
        <div class="attr-item"><span class="attr-label">Area</span><span class="attr-value">📐 ${esc(p.area)} ${esc(p.areaUnit)}</span></div>
        <div class="attr-item"><span class="attr-label">City</span><span class="attr-value">🏙 ${esc(p.city)}</span></div>
        <div class="attr-item"><span class="attr-label">District</span><span class="attr-value">${esc(p.district)}</span></div>
        <div class="attr-item"><span class="attr-label">Listed</span><span class="attr-value">${esc(p.listedDate)}</span></div>
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Description</h3>
      <p style="color:#374151;line-height:1.7">${esc(p.description)}</p>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Features</h3>
      <div class="features-list">
        ${(p.features || []).map(f => `<span class="feature-tag">${esc(f)}</span>`).join('')}
      </div>
      <h3 style="font-size:1.1rem;font-weight:700;margin:1.5rem 0 .5rem">Contact Agent</h3>
      <a href="tel:${esc(p.contact)}" class="btn btn-primary" style="display:inline-block">📞 ${esc(p.contact)}</a>
      <a href="/contact.html" class="btn btn-outline" style="display:inline-block;margin-left:.8rem">Send Inquiry</a>
    `;
  }

  // ── Firestore real-time path ──────────────────────────────────────────
  if (window.neListenProperty) {
    main.innerHTML = '<div class="spinner"></div>';
    _unsubDetail = window.neListenProperty(Number(id), function (p) {
      if (p === null && !window.neFirestore) {
        // Firestore error — fall back to REST
        _unsubDetail = null;
        loadPropertyDetailREST(id, main, render);
      } else {
        render(p);
      }
    });
    return;
  }

  // ── REST API fallback ─────────────────────────────────────────────────
  loadPropertyDetailREST(id, main, render);
}

async function loadPropertyDetailREST(id, main, render) {
  try {
    const res = await fetch(`${API}/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error(res.status);
    render(await res.json());
  } catch {
    render(null);
  }
}

// ── Contact form submission ───────────────────────────────────────────────
async function handleContactSubmit(e) {
  e.preventDefault();
  const form   = e.target;
  const btn    = form.querySelector('[type=submit]');
  const status = document.getElementById('contactStatus');

  btn.textContent = 'Sending…';
  btn.disabled = true;
  if (status) { status.textContent = ''; status.className = 'contact-status'; }

  try {
    const res  = await fetch('/api/contact', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Submission failed');

    form.reset();
    if (status) {
      status.textContent = '✅ ' + data.message;
      status.className = 'contact-status contact-status--ok';
    }
  } catch (err) {
    if (status) {
      status.textContent = '❌ ' + (err.message || 'Unable to send. Please try again.');
      status.className = 'contact-status contact-status--err';
    }
  } finally {
    btn.textContent = 'Submit Inquiry';
    btn.disabled = false;
  }
}
