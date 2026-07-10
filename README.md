# Cascade — Daily Thread Puzzle

A Reddit-native daily puzzle game played entirely in the comment thread. New puzzle every day, scored automatically, leaderboard updated live.

## Play
Head to [r/AgenticDaily](https://www.reddit.com/r/AgenticDaily/) and reply to today's puzzle post with your answer.

## How it works
1. The **agent pipeline** scrapes daily Reddit themes, generates a unique puzzle, and posts it.
2. You **reply** to the puzzle post with your move.
3. The **judge agent** scores answers and updates the leaderboard.
4. Come back tomorrow for a new puzzle and keep your streak.

## Tech
- [Devvit Web](https://developers.reddit.com/) — runs inside Reddit
- [React](https://react.dev/) + Vite — frontend
- [Hono](https://hono.dev/) — backend routes
- **Agentic pipeline** — scraper → generator → validator → judge

## Repo structure
```
src/
  client/       — React UI (Devvit Web)
  server/       — Hono backend + agent pipeline
  agent/        — scraper, generator, validator, judge
  storage/      — Devvit KV wrapper
.github/workflows/ — daily scheduled puzzle job
puzzles/        — daily generated puzzle JSON artifacts
```

## Status
Hackathon submission for **Reddit Games with a Hook** (Jul 2026).
