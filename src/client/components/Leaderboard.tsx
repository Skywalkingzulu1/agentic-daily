import { useEffect, useState } from 'react';

type Entry = { user: string; score: number; streak: number };

export default function Leaderboard() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then(setEntries)
      .catch(() => setEntries([
        { user: 'demo_user', score: 120, streak: 5 },
        { user: 'puzzle_fan', score: 95, streak: 3 },
      ]));
  }, []);

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      <ol>
        {entries.map((e, i) => (
          <li key={e.user} className={i === 0 ? 'first' : ''}>
            <span className="rank">#{i + 1}</span>
            <span className="name">{e.user}</span>
            <span className="score">{e.score} pts</span>
            <span className="streak">🔥 {e.streak}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
