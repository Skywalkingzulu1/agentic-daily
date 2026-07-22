# Cascade — Submission Draft for Devpost

## Project Name
Cascade

## Tagline
A daily thread puzzle game where Reddit comments ARE the gameplay.

## Category
Best App with a Hook / Best Use of Retention Mechanics / Best Use of User Contributions

## What We Built
Cascade is a Reddit-native daily puzzle game built on Devvit Web. Every 24 hours, an autonomous agent pipeline scrapes top themes from r/all, generates a unique puzzle, and posts it to r/AgenticDaily. Players solve puzzles by replying directly to the post's comment thread — no external site, no app download, no friction. The judge agent reads replies, awards points, tracks streaks, and updates the live leaderboard.

The agentic layer is load-bearing but invisible: the product IS the puzzle, not the AI.

## Tech Stack
- **Devvit Web** — runs natively inside Reddit
- **React + Vite** — mobile-first frontend
- **Hono** — backend routes
- **Agentic pipeline** — scraper → generator → validator → judge (fully autonomous)

## What Makes It Different
1. **Comments as gameplay**: The Reddit comment thread is the gameplay surface. Players don't leave Reddit to play.
2. **Daily generative content**: Each puzzle is seeded from live Reddit themes, making every day unique and un-Googlable.
3. **Retention built in**: Streaks, seasonal leaderboards, and rotating mechanics (pattern, word chain, logic grid, emoji math, number path) create hook-y daily return loops.
4. **Zero collision**: No existing public repo combines daily puzzle + comment orchestration + agentic generation.

## Traction / Polish
- 5 demo puzzles pre-generated and committed to repo
- GitHub Actions workflow scheduled daily at 9am UTC
- Mobile-first UI tested for 375px width
- Full TypeScript type safety, Zod validation, and deterministic puzzle verification
- Public GitHub Pages landing page

## Team
Solo submission.

## Repository
https://github.com/Skywalkingzulu1/agentic-daily
