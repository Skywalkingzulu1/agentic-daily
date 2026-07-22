import { Hono } from 'hono';

type Env = {
  devvitKv: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    list(prefix: string): Promise<{ keys: { name: string }[] }>;
  };
};

type LeaderboardEntry = {
  username: string;
  score: number;
  streak: number;
};

const DEMO_ENTRIES: LeaderboardEntry[] = [
  { username: 'demo_user', score: 120, streak: 5 },
  { username: 'puzzle_fan', score: 95, streak: 3 },
  { username: 'riddlemaster', score: 80, streak: 2 },
  { username: 'cascade_pro', score: 65, streak: 4 },
  { username: 'daily_solver', score: 50, streak: 1 },
];

const app = new Hono<{ Bindings: Env }>();

app.get('/api/leaderboard', async (c) => {
  try {
    const kv = c.env.devvitKv;
    const keys = await kv.list('score:');
    const entries: LeaderboardEntry[] = [];

    for (const key of keys.keys) {
      const val = await kv.get(key.name);
      if (val && typeof val === 'object' && typeof val.score === 'number') {
        entries.push({
          username: key.name.replace('score:', ''),
          score: val.score,
          streak: val.streak || 0,
        });
      }
    }

    entries.sort((a, b) => b.score - a.score);

    if (entries.length === 0) {
      return c.json(DEMO_ENTRIES);
    }

    return c.json(entries.slice(0, 10));
  } catch {
    return c.json(DEMO_ENTRIES);
  }
});

export default app;
