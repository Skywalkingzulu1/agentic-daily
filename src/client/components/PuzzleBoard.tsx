import { useEffect, useState } from 'react';

export default function PuzzleBoard() {
  const [puzzle, setPuzzle] = useState<{ day: number; mechanic: string; prompt: string; seed: string } | null>(null);

  useEffect(() => {
    fetch('/api/puzzle/today')
      .then(r => r.json())
      .then(setPuzzle)
      .catch(() => {
        setPuzzle({
          day: 1,
          mechanic: 'pattern',
          prompt: 'What comes next? 2, 4, 8, 16, ?',
          seed: 'demo'
        });
      });
  }, []);

  if (!puzzle) return <div className="puzzle-board">Loading today's puzzle...</div>;

  return (
    <div className="puzzle-board">
      <div className="puzzle-meta">
        <span className="puzzle-day">Day {puzzle.day}</span>
        <span className="puzzle-mechanic">{puzzle.mechanic}</span>
      </div>
      <div className="puzzle-prompt">
        <p>{puzzle.prompt}</p>
      </div>
      <div className="puzzle-hint">
        Reply to this post with your answer. First correct answer gets bonus points.
      </div>
    </div>
  );
}
