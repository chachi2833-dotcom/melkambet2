# መልካም BET — Complete Setup Guide
### Ethiopia's Premier Telegram Mini App Betting Platform

---

## 📁 Files in This Project

```
melkambet/
├── public/
│   └── index.html          ← App entry point (Telegram SDK loaded here)
├── src/
│   ├── index.js            ← React startup file
│   ├── App.jsx             ← ENTIRE app (games, sports, login, etc.)
│   └── config.js           ← YOUR API keys go here
├── package.json            ← Project settings
├── netlify.toml            ← Netlify deploy config
└── .gitignore              ← Hides private files from GitHub
```

---

## 🚀 STEP-BY-STEP DEPLOYMENT (Free, Mobile-Friendly)

### STEP 1 — Create a GitHub Account
1. Open your phone browser → go to **github.com**
2. Tap **Sign up** → enter email, password, username
3. Verify your email

---

### STEP 2 — Create the GitHub Repository
1. On GitHub, tap the **+** icon (top right) → **New repository**
2. Repository name: `melkambet`
3. Make sure it says **Public**
4. Tap **Create repository**

---

### STEP 3 — Upload All Your Files to GitHub
For each file, do this:
1. On your repo page, tap **Add file** → **Create new file**
2. Type the file path exactly (e.g. `public/index.html`)
3. Paste the file contents
4. Tap **Commit new file**

**Upload these files in this order:**
1. `package.json`
2. `netlify.toml`
3. `.gitignore`
4. `public/index.html`
5. `src/index.js`
6. `src/config.js`
7. `src/App.jsx`  ← biggest file, paste last

---

### STEP 4 — Get Your Free Firebase Account
1. Go to **firebase.google.com** on your phone
2. Tap **Get started** → sign in with Google
3. Tap **Add project** → name it `melkambet`
4. Click through the steps → **Create project**
5. Once inside, tap the **</>** (web) icon
6. App nickname: `melkambet-web` → **Register app**
7. You'll see a config block like this:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "melkambet.firebaseapp.com",
     ...
   }
   ```
8. **Copy all of this** — you'll paste it into `src/config.js`

**Also enable Firestore:**
- Left menu → **Build** → **Firestore Database**
- **Create database** → **Start in test mode** → Choose a region → Enable

---

### STEP 5 — Get Your Free Odds API Key
1. Go to **the-odds-api.com**
2. Tap **Get API Key** → enter email → check your email for the key
3. It looks like: `a1b2c3d4e5f6g7h8i9j0...`
4. Paste it into `src/config.js` where it says `PASTE_YOUR_ODDS_API_KEY_HERE`

---

### STEP 6 — Update config.js on GitHub
1. On GitHub, open `src/config.js`
2. Tap the **pencil icon** (Edit)
3. Replace all the `PASTE_YOUR_..._HERE` placeholders with your real values
4. Tap **Commit changes**

---

### STEP 7 — Deploy to Netlify (Free Hosting)
1. Go to **netlify.com** on your phone
2. Tap **Sign up** → **Sign up with GitHub** (easiest)
3. Once logged in, tap **Add new site** → **Import an existing project**
4. Choose **GitHub** → select your `melkambet` repository
5. Build settings should auto-fill:
   - Build command: `npm run build`
   - Publish directory: `build`
6. Tap **Deploy site**
7. Wait 2–3 minutes → you get a URL like `https://melkambet-abc123.netlify.app`
8. **Copy this URL** — you need it for BotFather

---

### STEP 8 — Set Up Your Telegram Bot
1. Open Telegram → search for **@BotFather**
2. Send: `/newbot`
3. Bot name: `Melkam Bet`
4. Username: `melkambet_bot` (or similar, must be unique)
5. BotFather gives you a **token** — save it somewhere safe
6. Now send: `/newapp`
7. Choose your bot → follow the prompts:
   - Title: `Melkam Bet`
   - Description: `Ethiopia's #1 betting app. Sports, Casino, Virtual games.`
   - Photo: upload a gold/dark logo image
   - URL: paste your Netlify URL
8. BotFather gives you a **Mini App link** like `t.me/melkambet_bot/app`

---

### STEP 9 — Test Your App
1. Open the Mini App link in Telegram
2. It should load your app inside Telegram
3. Tap **Login with Telegram** — it asks for your phone number
4. Your balance starts at 500 ETB (demo)
5. Test a game, place a bet, check the deposit page

---

## 💰 How Player Deposits Work (Manual for Now)

Since you have no budget yet, deposits work like this:
1. Player opens Deposit page → sees your Telebirr/CBE number
2. They send money to **0928 33 692**
3. They screenshot and send to **@melkambet_et**
4. You manually add their balance in Firebase:
   - Firebase console → Firestore → users → find their ID → edit balance

When you have budget, you can automate this with Chapa or Santimpay APIs.

---

## 🔄 How to Update the App Later

1. Edit the file on GitHub (pencil icon)
2. Commit the change
3. Netlify auto-rebuilds in ~2 minutes
4. No other steps needed

---

## 📞 Support
Telegram: @melkambet_et
Payment: 0928 33 692 (Telebirr / CBE Birr)
Min Bet: 50 ETB

---

## ⚠️ Important Notes

- The app stores data in the browser by default. Once you add Firebase config, data saves to the cloud.
- The Odds API free tier gives 500 requests/month. If you run out, the app shows demo matches.
- Keep your Firebase config and API keys private — never share them publicly.
- Gambling apps have legal requirements in Ethiopia — check local regulations.
