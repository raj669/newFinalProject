/**
 * firebase-config.js — Firebase Web App Configuration
 *
 * How to fill this in:
 *   1. Go to https://console.firebase.google.com
 *   2. Open your project → Project Settings (⚙) → General
 *   3. Scroll to "Your apps" and click your Web app (or create one with "</>" button)
 *   4. Copy the firebaseConfig object values into the fields below
 *   5. Also update .firebaserc with your project ID for CLI deploys
 *
 * When filled in, the browser will connect directly to Firestore for
 * real-time property updates. Until then the app falls back to the
 * Express REST API (/api/*) automatically — no breakage.
 */

const FIREBASE_WEB_CONFIG = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT_ID.firebaseapp.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId:             'YOUR_APP_ID',
};
