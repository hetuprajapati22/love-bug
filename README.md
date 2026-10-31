# Love Bug 🐛💗 | Romantic Couple Web App

A cute, aesthetic, real-time web game designed exclusively for couples to connect, laugh, and fall deeper in love through three intimate games, instant live chat, and personalized love letters.

---

## ✨ Key Features

- **💑 Real-Time Couple Pairing:** Connect with your partner using cute invite codes (`LB-XXXX`) or one-click WhatsApp sharing.
- **🎮 Three Intimate Games (180 Total Questions):**
  - **💗 This or That (60 Questions):** Discover how your preferences align across 5 progressive stages (*Playful, Cozy, Closer, Deep, Spicy*).
  - **🥹 How Well Do You Know Me (60 Questions):** Guess each other's secret thoughts and funny habits.
  - **😈 Truth or Dare (60 Questions):** Romantic confessions and cute couple challenges with a custom 2-phase reveal.
- **🔒 Simultaneous Reveal Engine:** Answers are locked on the server and revealed together only when both partners have submitted.
- **💬 Live Real-Time Couple Chat:** Built-in instant messaging directly with your partner, love stickers (`😘`, `☕`, `❤️`), and Love Bug AI date-idea assistant.
- **🎵 Romantic Soundscapes:** Gentle chimes, answer match chords, and wooden lock ticks via the Web Audio API with sound toggle.
- **💌 The Sealed Romantic Love Letter:** Beautiful cursive letter rendered on vintage parchment, celebrating your shared connection and compatibility score.
- **📱 PWA Ready:** Installable on any iOS or Android smartphone as a native-like app.

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite (JavaScript), Pure Vanilla CSS (CSS Design Tokens, Glassmorphism, Zero UI frameworks)
- **Routing:** React Router v7
- **Backend & Database:** Supabase (PostgreSQL, Realtime Broadcast, Row-Level Security, RPCs)
- **Audio:** Web Audio API (Zero external MP3 dependencies)
- **Fonts:** Fraunces (Headings), Nunito (Body), Caveat (Romantic Cursive Letter)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd love-bug
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-publishable-key
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
love-bug/
├── public/
│   ├── favicon.svg             # Love Bug Mascot Favicon
│   └── manifest.json           # Mobile PWA Manifest
├── src/
│   ├── components/
│   │   ├── chat/CoupleChat.jsx # Live Partner Chat & Love Bug AI
│   │   ├── mascot/LoveBug.jsx  # SVG Mascot with 4 reactive moods
│   │   ├── ui/HeartConfetti.jsx # Match heart explosion effect
│   │   └── ui/StatsModal.jsx   # Couple milestones & achievements
│   ├── games/
│   │   ├── thisOrThat/         # 60 questions (5 stages × 12)
│   │   ├── knowMe/             # 60 questions (5 stages × 12)
│   │   └── truthOrDare/        # 60 questions (5 stages × 12)
│   ├── pages/
│   │   ├── Login.jsx           # Google OAuth & Demo sign-in
│   │   ├── ProfileSetup.jsx    # Pet name & heart color customizer
│   │   ├── CoupleRoom.jsx      # Invite code pairing hub
│   │   ├── Dashboard.jsx       # Main couple dashboard & milestones
│   │   ├── Lobby.jsx           # Synchronized waiting lobby
│   │   ├── GameScreen.jsx      # Multi-game simultaneous play engine
│   │   └── Results.jsx         # Compatibility meter & Sealed Letter
│   ├── styles/                 # Design tokens, glassmorphism & keyframes
│   └── utils/soundEffects.js   # Pure Web Audio sound engine
└── supabase/migrations/        # SQL schemas, RLS policies, and RPCs
```

---

Made with 💗 for sweethearts everywhere.
