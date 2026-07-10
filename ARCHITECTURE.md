# Architecture

## System Overview
Cascade is a daily puzzle game built on Reddit's Devvit platform. The entire gameplay loop happens inside Reddit comment threads — no external app required.

## Data Flow
```
Reddit Users
   │
   ▼
Devvit Web (React inline app)
   │  fetch('/api/puzzle/today')
   ▼
Hono Server (hosted on Reddit edge)
   │
   ├─► GET /api/puzzle/today → returns today's puzzle JSON
   ├─► POST /api/puzzle/submit → judges answer, awards points
   ├─► GET /api/leaderboard → returns top 10 players
   └─► POST /api/webhook/reddit → receives comment events
           │
           ▼
       Agent Pipeline (GitHub Actions / scheduled)
           │
           ├─► Scraper: pulls top post titles from r/all
           ├─► Generator: builds puzzle from scraped themes
           ├─► Validator: confirms puzzle has unique solution
           └─► Poster: publishes puzzle to r/AgenticDaily
```

## Storage
- **Devvit KV**: live game state (scores, streaks, today's puzzle)
- **GitHub repo**: audit log of daily puzzle artifacts in `puzzles/`
- **Reddit comments**: gameplay surface + move submission

## Agentic Differentiator
The scraper → generator → validator → judge pipeline is autonomous and runs on a schedule. Unlike a static puzzle app, Cascade's content is seeded from live Reddit, making each day's puzzle genuinely fresh and un-Googlable.
