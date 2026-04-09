'use strict';
/**
 * NepalEstates API Test Suite
 * Run: npm test  (node --test tests/api.test.js)
 */
const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');

const app = require('../server.js');

const TEST_PORT = 3099;
let server;
let BASE;

before(async () => {
  await new Promise(resolve => {
    server = app.listen(TEST_PORT, resolve);
  });
  BASE = `http://localhost:${TEST_PORT}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
});

// ── Static file serving ───────────────────────────────────────────────────
describe('Static files', () => {
  test('GET / returns HTML', async () => {
    const res = await fetch(`${BASE}/`);
    assert.equal(res.status, 200);
    const ct = res.headers.get('content-type');
    assert.ok(ct && ct.includes('text/html'), `Expected text/html, got ${ct}`);
  });
});

// ── GET /api/properties ───────────────────────────────────────────────────
describe('GET /api/properties', () => {
  test('returns 200 with an array', async () => {
    const res = await fetch(`${BASE}/api/properties`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data), 'response should be an array');
    assert.ok(data.length > 0, 'should have at least one property');
  });

  test('each property has required fields', async () => {
    const res = await fetch(`${BASE}/api/properties`);
    const data = await res.json();
    const required = ['id', 'title', 'type', 'status', 'price', 'city', 'district'];
    for (const prop of data) {
      for (const field of required) {
        assert.ok(Object.prototype.hasOwnProperty.call(prop, field),
          `Property id=${prop.id} missing field: ${field}`);
      }
    }
  });

  test('filter by type=apartment', async () => {
    const res = await fetch(`${BASE}/api/properties?type=apartment`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.length > 0, 'should return some apartments');
    for (const p of data) assert.equal(p.type, 'apartment');
  });

  test('filter by status=sale', async () => {
    const res = await fetch(`${BASE}/api/properties?status=sale`);
    const data = await res.json();
    assert.ok(data.length > 0);
    for (const p of data) assert.equal(p.status, 'sale');
  });

  test('filter by status=rent', async () => {
    const res = await fetch(`${BASE}/api/properties?status=rent`);
    const data = await res.json();
    assert.ok(data.length > 0);
    for (const p of data) assert.equal(p.status, 'rent');
  });

  test('filter by city=Kathmandu (case-insensitive)', async () => {
    const res = await fetch(`${BASE}/api/properties?city=kathmandu`);
    const data = await res.json();
    assert.ok(data.length > 0);
    for (const p of data) assert.equal(p.city.toLowerCase(), 'kathmandu');
  });

  test('filter by minPrice', async () => {
    const min = 10000000;
    const res = await fetch(`${BASE}/api/properties?minPrice=${min}`);
    const data = await res.json();
    for (const p of data) assert.ok(p.price >= min, `price ${p.price} < minPrice ${min}`);
  });

  test('filter by maxPrice', async () => {
    const max = 25000000;
    const res = await fetch(`${BASE}/api/properties?maxPrice=${max}`);
    const data = await res.json();
    for (const p of data) assert.ok(p.price <= max, `price ${p.price} > maxPrice ${max}`);
  });

  test('filter by minPrice and maxPrice', async () => {
    const res = await fetch(`${BASE}/api/properties?minPrice=5000000&maxPrice=20000000`);
    const data = await res.json();
    for (const p of data) {
      assert.ok(p.price >= 5000000 && p.price <= 20000000);
    }
  });

  test('filter by bedrooms', async () => {
    const res = await fetch(`${BASE}/api/properties?bedrooms=3`);
    const data = await res.json();
    assert.ok(data.length > 0);
    for (const p of data) assert.ok(p.bedrooms >= 3);
  });

  test('filter by featured=true', async () => {
    const res = await fetch(`${BASE}/api/properties?featured=true`);
    const data = await res.json();
    assert.ok(data.length > 0);
    for (const p of data) assert.equal(p.featured, true);
  });

  test('filter by featured=false returns non-featured listings', async () => {
    const res = await fetch(`${BASE}/api/properties?featured=false`);
    const data = await res.json();
    for (const p of data) assert.equal(p.featured, false);
  });

  test('combined filters: type + status + city', async () => {
    const res = await fetch(`${BASE}/api/properties?type=apartment&status=sale&city=Kathmandu`);
    const data = await res.json();
    for (const p of data) {
      assert.equal(p.type, 'apartment');
      assert.equal(p.status, 'sale');
      assert.equal(p.city.toLowerCase(), 'kathmandu');
    }
  });

  test('returns empty array for impossible filter combination', async () => {
    const res = await fetch(`${BASE}/api/properties?type=villa&status=rent&city=Biratnagar`);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.equal(data.length, 0);
  });

  test('array-injection on city does not crash the server', async () => {
    // Express parses ?city[]=foo as { city: ['foo'] } — must not throw 500
    const res = await fetch(`${BASE}/api/properties?city[]=Kathmandu`);
    // Should return 200 (no filter applied, because value is not a string)
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });
});

// ── GET /api/properties/featured ─────────────────────────────────────────
describe('GET /api/properties/featured', () => {
  test('returns 200 with featured properties only', async () => {
    const res = await fetch(`${BASE}/api/properties/featured`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    assert.ok(data.length > 0);
    for (const p of data) assert.equal(p.featured, true);
  });
});

// ── GET /api/properties/:id ───────────────────────────────────────────────
describe('GET /api/properties/:id', () => {
  test('returns 200 for a valid existing ID', async () => {
    const res = await fetch(`${BASE}/api/properties/1`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.id, 1);
    assert.ok(typeof data.title === 'string');
  });

  test('returns 404 for non-existent numeric ID', async () => {
    const res = await fetch(`${BASE}/api/properties/99999`);
    assert.equal(res.status, 404);
    const data = await res.json();
    assert.ok(data.error, 'should return an error message');
  });

  test('returns 400 for non-numeric ID', async () => {
    const res = await fetch(`${BASE}/api/properties/abc`);
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error, 'should return an error message');
  });

  test('returns 400 for ID that is not a number (special chars)', async () => {
    const res = await fetch(`${BASE}/api/properties/1%3B%20DROP%20TABLE`);
    assert.equal(res.status, 400);
  });
});

// ── Unmatched /api/* paths ────────────────────────────────────────────────
describe('Unmatched API paths', () => {
  test('GET /api/unknown returns JSON 404, not HTML', async () => {
    const res = await fetch(`${BASE}/api/unknown-endpoint`);
    assert.equal(res.status, 404);
    const ct = res.headers.get('content-type');
    assert.ok(ct && ct.includes('application/json'), `Expected JSON, got ${ct}`);
    const data = await res.json();
    assert.ok(data.error);
  });
});

// ── POST /api/contact ─────────────────────────────────────────────────────
describe('POST /api/contact', () => {
  const post = (body) => fetch(`${BASE}/api/contact`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(body),
  });

  test('returns 201 with a valid inquiry', async () => {
    const res  = await post({ name: 'Ram Thapa', email: 'ram@example.com', message: 'I am interested.' });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.success, true);
    assert.ok(typeof data.message === 'string');
  });

  test('returns 400 when name is missing', async () => {
    const res = await post({ email: 'ram@example.com', message: 'Hi' });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  test('returns 400 when email is missing', async () => {
    const res = await post({ name: 'Ram', message: 'Hi' });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  test('returns 400 when email is malformed', async () => {
    const res = await post({ name: 'Ram', email: 'not-an-email', message: 'Hi' });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  test('returns 400 when message is missing', async () => {
    const res = await post({ name: 'Ram', email: 'ram@example.com' });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.ok(data.error);
  });

  test('accepts optional phone and interest fields', async () => {
    const res = await post({
      name:     'Sita Sharma',
      email:    'sita@example.com',
      phone:    '+977-9801111222',
      interest: 'buy',
      message:  'Looking for a 3BHK in Kathmandu.',
    });
    assert.equal(res.status, 201);
  });
});

