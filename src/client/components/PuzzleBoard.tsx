import { useEffect, useState } from 'react';

type Puzzle = {
  day: number;
  mechanic: string;
  prompt: string;
  hints: string[];
  answer?: string;
};

export default function PuzzleBoard() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [hintsOpen, setHintsOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/puzzle/today')
      .then(r => r.json())
      .then((data: Puzzle) => {
        setPuzzle(data);
        setLoaded(true);
      })
      .catch(() => {
        setPuzzle({
          day: 1,
          mechanic: 'pattern',
          prompt: 'What comes next? 2, 4, 8, 16, ?',
          hints: ['Each number doubles the previous one.', 'Think powers of 2.'],
          answer: '32',
        });
        setLoaded(true);
      });
  }, []);

  if (!puzzle || !loaded) {
    return <div className="puzzle-board loading">Loading today's puzzle...</div>;
  }

  return (
    <div className={`puzzle-board${loaded ? ' loaded' : ''}`}>
      <div className="puzzle-meta">
        <span className="puzzle-day">Day {puzzle.day}</span>
        <span className="puzzle-mechanic">{puzzle.mechanic}</span>
      </div>
      <div className="puzzle-prompt">
        <p>{puzzle.prompt}</p>
      </div>
      <div className="puzzle-hints">
        <button
          className="hints-toggle"
          onClick={() => setHintsOpen(!hintsOpen)}
          aria-expanded={hintsOpen}
        >
          {hintsOpen ? 'Hide Hints' : 'Show Hints'}
        </button>
        {hintsOpen && (
          <ul className="hints-list">
            {puzzle.hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="puzzle-reveal">
        <button className="reveal-btn" onClick={() => setRevealed(!revealed)}>
          {revealed ? 'Hide Answer' : 'Reveal Answer'}
        </button>
        {revealed && puzzle.answer && (
          <span className="reveal-answer">Answer: {puzzle.answer}</span>
        )}
      </div>
    </div>
  );
}
