'use strict';

const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK with service account
let serviceAccount;
try {
  // Load Firebase service account from environment variable
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!serviceAccountJson) {
    console.warn('⚠ FIREBASE_SERVICE_ACCOUNT not configured. Firebase features will be disabled.');
    module.exports = {
      db: null,
      auth: null,
      storage: null,
      isInitialized: false,
    };
  } else {
    serviceAccount = JSON.parse(serviceAccountJson);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    });

    console.log('✓ Firebase initialized successfully');

    module.exports = {
      db: admin.firestore(),
      auth: admin.auth(),
      storage: admin.storage(),
      isInitialized: true,
    };
  }
} catch (error) {
  console.error('Firebase initialization error:', error.message);
  module.exports = {
    db: null,
    auth: null,
    storage: null,
    isInitialized: false,
  };
}
