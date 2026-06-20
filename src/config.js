// ─────────────────────────────────────────────────────────────────────────────
// MELKAM BET — Firebase Configuration
// ─────────────────────────────────────────────────────────────────────────────
//
// HOW TO SET THIS UP (free):
//
// 1. Go to https://firebase.google.com
// 2. Click "Get started" → "Add project"
// 3. Name it "melkambet" → Continue → Continue → Create project
// 4. Click the </> Web icon to add a web app
// 5. Name it "melkambet-web" → Register app
// 6. Copy the config values below into this file
// 7. In the Firebase console, go to:
//    - Build → Firestore Database → Create database → Start in test mode
//    - Build → Authentication → Sign-in method → Anonymous → Enable
//
// ─────────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_AUTH_DOMAIN_HERE",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_STORAGE_BUCKET_HERE",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE"
};

// ─────────────────────────────────────────────────────────────────────────────
// The Odds API Key
// Get your FREE key at: https://the-odds-api.com
// Free tier = 500 requests/month (enough for testing)
// ─────────────────────────────────────────────────────────────────────────────

export const ODDS_API_KEY = "51d4c6ce7b8b5e527a0ae793e48c6e62";

// ─────────────────────────────────────────────────────────────────────────────
// Payment Details (change anytime)
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT = {
  telebirr: "0928 33 692",
  cbeBirr:  "0928 33 692",
  supportTelegram: "@melkambet_et"
};
