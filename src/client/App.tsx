import { useRouteLogic } from 'devvit/client';
import PuzzleBoard from './components/PuzzleBoard';
import MoveInput from './components/MoveInput';
import Leaderboard from './components/Leaderboard';

export default function App() {
  const { post, user } = useRouteLogic();

  return (
    <div className="app">
      <header className="app-header">
        <h1> Cascade</h1>
        <p className="subtitle">Daily Thread Puzzle</p>
      </header>

      <main className="app-main">
        <PuzzleBoard />
        <MoveInput />
        <Leaderboard />
      </main>

      <footer className="app-footer">
        <p>Play by replying to today's puzzle post</p>
      </footer>
    </div>
  );
}
