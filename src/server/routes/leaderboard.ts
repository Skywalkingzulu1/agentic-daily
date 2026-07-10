import { Hono } from 'hono';

const app = new Hono();

app.get('/api/leaderboard', async (c) => {
  const kv = c.get('devvit-kv');
  const keys = await kv.list('score:');
  const entries: any[] = [];
  for (const key of keys) {
    const val = await kv.get(key);
    if (val) entries.push(val);
  }
  entries.sort((a, b) => b.score - a.score);
  return c.json(entries.slice(0, 10));
});

export default app;
