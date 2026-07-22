import { Hono } from 'hono';

type Env = {
  devvitKv: {
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    list(prefix: string): Promise<{ keys: { name: string }[] }>;
  };
};

const app = new Hono<{ Bindings: Env }>();

app.post('/api/webhook/reddit', async (c) => {
  try {
    const payload = await c.req.json<{ comment: { id: string; parent_id: string; author?: string; body?: string }; post: { id: string } }>();
    const { comment, post } = payload;

    if (!comment || !post || !comment.id || !post.id) {
      return c.json({ acknowledged: false, correct: false, pointsAwarded: 0 }, 400);
    }

    const isRootReply = comment.parent_id === post.id;
    if (!isRootReply) {
      return c.json({ acknowledged: true, correct: false, pointsAwarded: 0 });
    }

    const today = new Date();
    const dayKey = `day:${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const kv = c.env.devvitKv;
    const stored = await kv.get(dayKey);
    const puzzle = stored as { answer?: string } | undefined;
    const correctAnswer = puzzle?.answer?.toLowerCase().trim();

    if (!correctAnswer || !comment.body) {
      return c.json({ acknowledged: true, correct: false, pointsAwarded: 0 });
    }

    const userAnswer = comment.body.toLowerCase().trim();
    const isCorrect = userAnswer === correctAnswer;
    const pointsAwarded = isCorrect ? 10 : 0;
    const userId = comment.author || 'anon';

    if (isCorrect) {
      const scoreKey = `score:${userId}`;
      const current = (await kv.get(scoreKey)) || { score: 0, streak: 0, lastDay: '' };
      const prevDay = current.lastDay as string || '';

      let streak = current.streak || 0;
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      if (prevDay === yesterdayKey) {
        streak += 1;
      } else if (prevDay !== dayKey.replace('day:', '')) {
        streak = 1;
      }

      await kv.set(scoreKey, {
        score: (current.score || 0) + pointsAwarded,
        streak,
        lastDay: dayKey.replace('day:', ''),
      });
    }

    return c.json({ acknowledged: true, correct: isCorrect, pointsAwarded });
  } catch {
    return c.json({ acknowledged: false, correct: false, pointsAwarded: 0 }, 500);
  }
});

export default app;
