import { Hono } from 'hono';
import { z } from 'zod';

const app = new Hono();

app.get('/api/puzzle/today', (c) => {
  return c.json({
    day: 1,
    mechanic: 'pattern',
    prompt: 'What comes next? 2, 4, 8, 16, ?',
    seed: 'demo',
    answer: '32',
  });
});

const SubmitSchema = z.object({ answer: z.string().min(1).max(200) });

app.post('/api/puzzle/submit', async (c) => {
  const body = await c.req.json();
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ correct: false, error: 'invalid' }, 400);
  }

  const { answer } = parsed.data;
  const normalized = answer.trim().toLowerCase();

  const puzzle = await getTodayPuzzle(c);
  const correct = normalized === puzzle.answer.toLowerCase();

  if (correct) {
    await incrementScore(c, c.req.header('x-reddit-user-id') || 'anon', 10);
  }

  return c.json({ correct });
});

app.get('/api/leaderboard', async (c) => {
  const board = await getLeaderboard(c);
  return c.json(board);
});

async function getTodayPuzzle(c: any) {
  const kv = c.get('devvit-kv');
  const stored = await kv.get('puzzle:today');
  if (stored) return stored as any;
  return { day: 1, mechanic: 'pattern', prompt: 'What comes next? 2, 4, 8, 16, ?', seed: 'demo', answer: '32' };
}

async function incrementScore(c: any, userId: string, delta: number) {
  const kv = c.get('devvit-kv');
  const key = `score:${userId}`;
  const current = ((await kv.get(key)) as any) || { score: 0, streak: 0 };
  await kv.set(key, { score: current.score + delta, streak: current.streak + 1 });
}

async function getLeaderboard(c: any) {
  const kv = c.get('devvit-kv');
  const keys = await kv.list('score:');
  const entries: any[] = [];
  for (const key of keys) {
    const val = await kv.get(key);
    if (val) entries.push(val);
  }
  entries.sort((a, b) => b.score - a.score);
  return entries.slice(0, 10);
}

export default app;
