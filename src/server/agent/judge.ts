import { Hono } from 'hono';

const app = new Hono();

app.post('/api/webhook/reddit', async (c) => {
  const payload = await c.req.json();
  const { comment, post } = payload;

  if (!comment || !post) {
    return c.text('No comment or post', 400);
  }

  const isRootReply = comment.parent_id === post.id;

  return c.json({
    acknowledged: true,
    isPuzzleThread: isRootReply,
    wouldScore: isRootReply,
  });
});

export default app;
