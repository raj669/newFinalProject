/**
 * Firebase Admin SDK initialisation.
 *
 * Credentials are resolved in priority order:
 *   1. GOOGLE_APPLICATION_CREDENTIALS env var pointing to a service-account JSON file
 *   2. FIREBASE_SERVICE_ACCOUNT env var containing the service-account JSON as a string
 *   3. Application Default Credentials (works automatically in Firebase Hosting + Cloud Run)
 *
 * Required env vars (if not using ADC):
 *   FIREBASE_PROJECT_ID          – your Firebase project ID
 *   GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT (see above)
 */

const admin = require('firebase-admin');

if (!admin.apps.length) {
  let credential;

  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // Service-account JSON supplied as an environment variable string
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(serviceAccount);
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS file path or ADC
    credential = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

const db = admin.firestore();

module.exports = { admin, db };
