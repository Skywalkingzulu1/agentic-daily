import devvit from 'devvit';
import puzzlesRoutes from './routes/puzzles.js';
import leaderboardRoutes from './routes/leaderboard.js';
import judgeRoutes from './agent/judge.js';

function withCors(app: any) {
  app.use('*', async (c: any, next: any) => {
    c.header('Access-Control-Allow-Origin', '*');
    c.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (c.req.method === 'OPTIONS') {
      return c.text('', 200);
    }
    await next();
  });
  return app;
}

export default class Server extends devvit.Server<any> {
  routes = [
    { path: '/api/puzzle/*', handler: withCors(puzzlesRoutes as any) },
    { path: '/api/leaderboard', handler: withCors(leaderboardRoutes as any) },
    { path: '/api/webhook/reddit', handler: withCors(judgeRoutes as any) },
  ];
}
