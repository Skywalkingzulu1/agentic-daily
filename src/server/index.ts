import devvit from 'devvit';
import puzzlesRoutes from './routes/puzzles.js';
import leaderboardRoutes from './routes/leaderboard.js';
import judgeRoutes from './routes/judge.js';

export default class Server extends devvit.Server<
  typeof puzzlesRoutes | typeof leaderboardRoutes | typeof judgeRoutes
> {
  routes = [
    { path: '/api/puzzle/*', handler: puzzlesRoutes },
    { path: '/api/leaderboard', handler: leaderboardRoutes },
    { path: '/api/webhook/reddit', handler: judgeRoutes },
  ];
}
