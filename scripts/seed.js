/**
 * seed.js — One-time script to import data/properties.json into Firestore.
 *
 * Usage:
 *   FIREBASE_PROJECT_ID=your-project-id \
 *   GOOGLE_APPLICATION_CREDENTIALS=path/to/serviceAccount.json \
 *   node scripts/seed.js
 *
 * Or using an inline service account:
 *   FIREBASE_PROJECT_ID=your-project-id \
 *   FIREBASE_SERVICE_ACCOUNT='{"type":"service_account",...}' \
 *   node scripts/seed.js
 *
 * The script is idempotent: it uses each property's numeric `id` as the
 * Firestore document ID so re-running will overwrite existing documents
 * rather than creating duplicates.
 */

'use strict';

const path = require('path');
const fs   = require('fs');

if (!process.env.FIREBASE_PROJECT_ID) {
  console.error('Error: FIREBASE_PROJECT_ID environment variable is required.');
  process.exit(1);
}
if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('Error: GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT is required.');
  process.exit(1);
}

const { db } = require('../config/firebase');

async function seed() {
  const filePath   = path.join(__dirname, '../data/properties.json');
  const properties = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  console.log(`Seeding ${properties.length} properties into Firestore…`);

  const collection = db.collection('properties');
  const batch      = db.batch();

  for (const property of properties) {
    const docRef = collection.doc(String(property.id));
    batch.set(docRef, property);
  }

  await batch.commit();
  console.log(`✅ Done — ${properties.length} documents written to "properties" collection.`);
}

seed().catch(err => {
  console.error('Seed failed:', err.message || err);
  process.exit(1);
});
