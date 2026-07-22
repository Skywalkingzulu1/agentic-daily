import { Hono, Context } from 'hono';
import { z } from 'zod';
import { generatePuzzle } from '../agent/generator.js';
import { validatePuzzle } from '../agent/validator.js';
import { scrapeThemes } from '../agent/scraper.js';

type Env = {
  devvitKv: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    list(prefix: string): Promise<{ keys: { name: string }[] }>;
  };
};

const app = new Hono<{ Bindings: Env }>();

function dayKey(day: number): string {
  return `puzzle:day:${day}`;
}

function todayKey(): string {
  const now = new Date();
  return `puzzle:day:${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

app.get('/api/puzzle/today', async (c) => {
  try {
    const kv = c.env.devvitKv;
    const key = todayKey();
    const stored = await kv.get(key);
    if (stored && validatePuzzle(stored)) {
      return c.json(stored);
    }
    const themes = await scrapeThemes(['all']);
    const dayNum = await getCurrentDay(c);
    const puzzle = await generatePuzzle(dayNum, themes);
    await kv.set(key, puzzle);
    return c.json(puzzle);
  } catch (err) {
    return c.json({ error: 'Failed to load today puzzle' }, 500);
  }
});

app.get('/api/puzzle/:day', async (c) => {
  try {
    const day = parseInt(c.req.param('day'), 10);
    if (Number.isNaN(day) || day < 1) {
      return c.json({ error: 'Invalid day' }, 400);
    }
    const kv = c.env.devvitKv;
    const stored = await kv.get(dayKey(day));
    if (stored && validatePuzzle(stored)) {
      return c.json(stored);
    }
    const themes = await scrapeThemes(['all']);
    const puzzle = await generatePuzzle(day, themes);
    await kv.set(dayKey(day), puzzle);
    return c.json(puzzle);
  } catch (err) {
    return c.json({ error: 'Failed to load puzzle' }, 500);
  }
});

app.post('/api/puzzle/seed', async (c) => {
  try {
    const BodySchema = z.object({ day: z.number().int().positive() });
    const body = BodySchema.safeParse(await c.req.json());
    if (!body.success) {
      return c.json({ error: 'Invalid body' }, 400);
    }
    const day = body.data.day;
    const kv = c.env.devvitKv;
    const themes = await scrapeThemes(['all']);
    const puzzle = await generatePuzzle(day, themes);
    if (!validatePuzzle(puzzle)) {
      return c.json({ error: 'Generated invalid puzzle' }, 500);
    }
    await kv.set(dayKey(day), puzzle);
    return c.json({ success: true, puzzle });
  } catch (err) {
    return c.json({ error: 'Failed to seed puzzle' }, 500);
  }
});

async function getCurrentDay(c: Context): Promise<number> {
  const kv = c.env.devvitKv;
  const meta = await kv.get('meta:currentDay');
  if (meta && typeof meta === 'object' && typeof (meta as any).day === 'number') {
    return (meta as any).day;
  }
  return 1;
}

export default app;
