'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

// Import the app (does NOT start listening because require.main !== module)
const app = require('../server');

let server;
let baseUrl;

// ---- helpers ----
function request(path) {
  return new Promise((resolve, reject) => {
    http.get(baseUrl + path, res => {
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, body });
        }
      });
    }).on('error', reject);
  });
}

test.before(() => new Promise(resolve => {
  server = app.listen(0, () => {
    baseUrl = `http://127.0.0.1:${server.address().port}`;
    resolve();
  });
}));

test.after(() => new Promise(resolve => {
  server.close(resolve);
}));

// ---- API tests ----

test('GET /api/properties returns all properties', async () => {
  const { status, body } = await request('/api/properties');
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.ok(Array.isArray(body.data));
  assert.ok(body.count > 0);
});

test('GET /api/properties?status=sale returns only sale listings', async () => {
  const { status, body } = await request('/api/properties?status=sale');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.status === 'sale'));
});

test('GET /api/properties?status=rent returns only rent listings', async () => {
  const { status, body } = await request('/api/properties?status=rent');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.status === 'rent'));
});

test('GET /api/properties?city=Pokhara filters by city', async () => {
  const { status, body } = await request('/api/properties?city=Pokhara');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.city.toLowerCase().includes('pokhara')));
});

test('GET /api/properties?type=apartment returns only apartments', async () => {
  const { status, body } = await request('/api/properties?type=apartment');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.type === 'apartment'));
});

test('GET /api/properties?featured=true returns only featured', async () => {
  const { status, body } = await request('/api/properties?featured=true');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.featured === true));
});

test('GET /api/properties/featured returns featured properties', async () => {
  const { status, body } = await request('/api/properties/featured');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.featured === true));
});

test('GET /api/properties/:id returns a specific property', async () => {
  const { status, body } = await request('/api/properties/1');
  assert.equal(status, 200);
  assert.equal(body.success, true);
  assert.equal(body.data.id, 1);
  assert.ok(body.data.title);
  assert.ok(body.data.price > 0);
});

test('GET /api/properties/:id with unknown id returns 404', async () => {
  const { status, body } = await request('/api/properties/99999');
  assert.equal(status, 404);
  assert.equal(body.success, false);
});

test('GET /api/properties/:id with invalid id returns 400', async () => {
  const { status, body } = await request('/api/properties/notanumber');
  assert.equal(status, 400);
  assert.equal(body.success, false);
});

test('GET /api/properties?minPrice filters by minimum price', async () => {
  const { status, body } = await request('/api/properties?minPrice=20000000');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.price >= 20000000));
});

test('GET /api/properties?maxPrice filters by maximum price', async () => {
  const { status, body } = await request('/api/properties?maxPrice=20000');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.price <= 20000));
});

test('GET /api/properties?bedrooms filters by minimum bedrooms', async () => {
  const { status, body } = await request('/api/properties?bedrooms=4');
  assert.equal(status, 200);
  assert.ok(body.data.every(p => p.bedrooms >= 4));
});

test('Properties have Nepal-specific fields (city, district, NPR price)', async () => {
  const { body } = await request('/api/properties');
  const p = body.data[0];
  assert.ok(p.city, 'city field exists');
  assert.ok(p.district, 'district field exists');
  assert.ok(typeof p.price === 'number', 'price is a number');
  assert.ok(p.price > 0, 'price is positive');
  assert.ok(p.contact, 'contact field exists');
});

test('Static HTML files are served', async () => {
  const res = await new Promise((resolve, reject) => {
    http.get(baseUrl + '/', res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    }).on('error', reject);
  });
  assert.equal(res.status, 200);
  assert.ok(res.body.includes('NepalEstates'));
});
