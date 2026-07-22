import { useRouteLogic, useUser } from 'devvit/client';
import PuzzleBoard from './components/PuzzleBoard';
import MoveInput from './components/MoveInput';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const { post } = useRouteLogic();
  const user = useUser();
  const username = user?.username || 'Guest';

  return (
    <div className="app">
      <header className="app-header">
        <h1>Cascade</h1>
        <p className="subtitle">Daily Thread Puzzle</p>
        <div className="streak-bar">
          <span className="streak-label">Streak</span>
          <span className="streak-count">0</span>
        </div>
      </header>

      <main className="app-main">
        <PuzzleBoard />
        <MoveInput />
        <Leaderboard currentUser={username !== 'Guest' ? username : undefined} />
      </main>

      <footer className="app-footer">
        <a href="#rules" className="rules-link">Rules</a>
        <p>Play by replying to today's puzzle post</p>
      </footer>
    </div>
  );
}
