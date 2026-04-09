/**
 * firebase-client.js — Firebase client-side SDK initialisation
 *
 * Requires: firebase-config.js loaded first (defines FIREBASE_WEB_CONFIG)
 * Requires: Firebase compat SDK scripts loaded from CDN (app-compat + firestore-compat)
 *
 * When FIREBASE_WEB_CONFIG is filled in with real values, this module:
 *   • Initialises the Firebase app
 *   • Exposes window.neFirestore (Firestore db instance)
 *   • Provides real-time listener helpers used by main.js
 *
 * When config is still the placeholder ("YOUR_API_KEY"), it does nothing and
 * main.js falls back to the Express REST API automatically.
 */

(function () {
  'use strict';

  // Detect placeholder config — do nothing so the REST-API fallback works
  if (
    typeof FIREBASE_WEB_CONFIG === 'undefined' ||
    FIREBASE_WEB_CONFIG.apiKey === 'YOUR_API_KEY' ||
    !FIREBASE_WEB_CONFIG.projectId
  ) {
    return;
  }

  try {
    firebase.initializeApp(FIREBASE_WEB_CONFIG);
    const db = firebase.firestore();

    // Persist data offline so the app still renders while the user is offline
    db.enablePersistence({ synchronizeTabs: true }).catch(() => {
      // Persistence may fail in incognito / private tabs — that is fine
    });

    // Expose globally for main.js
    window.neFirestore = db;

    /**
     * Attach a real-time listener on the properties collection.
     * @param {object}   filters  — same keys as REST API query params
     * @param {Function} callback — called with (Array<property>) on every update
     * @returns {Function} unsubscribe — call to stop listening
     */
    window.neListenProperties = function (filters, callback) {
      let query = db.collection('properties');

      // Apply simple equality filters directly in Firestore
      if (filters.type)     query = query.where('type',   '==', filters.type);
      if (filters.status)   query = query.where('status', '==', filters.status);
      if (filters.featured !== undefined)
        query = query.where('featured', '==', filters.featured === 'true' || filters.featured === true);

      query = query.orderBy('id');

      return query.onSnapshot(
        function (snapshot) {
          let results = snapshot.docs.map(function (d) { return d.data(); });

          // Apply remaining filters client-side (range/city — Firestore compound
          // index restrictions make server-side range combos expensive to set up)
          if (filters.city)
            results = results.filter(function (p) {
              return p.city.toLowerCase() === filters.city.toLowerCase();
            });
          if (filters.minPrice)
            results = results.filter(function (p) { return p.price >= Number(filters.minPrice); });
          if (filters.maxPrice)
            results = results.filter(function (p) { return p.price <= Number(filters.maxPrice); });
          if (filters.bedrooms)
            results = results.filter(function (p) { return p.bedrooms >= Number(filters.bedrooms); });

          callback(results);
        },
        function (err) {
          console.warn('[NeFirestore] listener error:', err.message);
          // Signal to caller that it should fall back to the REST API
          callback(null);
        }
      );
    };

    /**
     * Attach a real-time listener for a single property by its numeric id.
     * @param {number}   id       — property id
     * @param {Function} callback — called with (property|null) on every update
     * @returns {Function} unsubscribe
     */
    window.neListenProperty = function (id, callback) {
      return db.collection('properties')
        .where('id', '==', id)
        .limit(1)
        .onSnapshot(
          function (snapshot) {
            callback(snapshot.empty ? null : snapshot.docs[0].data());
          },
          function (err) {
            console.warn('[NeFirestore] listener error:', err.message);
            callback(null);
          }
        );
    };

    console.info('[NepalEstates] Firebase client connected to project:', FIREBASE_WEB_CONFIG.projectId);
  } catch (err) {
    console.warn('[NepalEstates] Firebase client init failed — using REST API fallback:', err.message);
  }
}());
