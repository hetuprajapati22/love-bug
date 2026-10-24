# Love Bug 🐛💗

A romantic, aesthetic web game designed exclusively for couples to connect, laugh, and strengthen their bond through three intimate games.

## Tech Stack
- **Frontend:** React + Vite (JavaScript), Plain CSS (Design Tokens, Glassmorphism)
- **Routing:** React Router v7
- **Backend & Realtime:** Supabase (Auth, PostgreSQL, Realtime, RLS)
- **PWA:** vite-plugin-pwa (Installable on mobile home screens)

## Project Structure
- `src/components/`: Reusable UI cards, buttons, mascot SVG, and chat sheet
- `src/games/`: Three game modules (`thisOrThat`, `knowMe`, `truthOrDare`)
- `src/pages/`: Screens (Login, Profile Setup, Dashboard, Lobby, Results, etc.)
- `src/styles/`: Design tokens, animations, and global typography/glass styles
- `supabase/`: Database migrations and question seeds

## Local Development
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app, or `http://localhost:5173/demo` to explore the visual demo dashboard.
