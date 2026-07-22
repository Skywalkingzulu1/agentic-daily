import { useEffect, useState } from 'react';

type Entry = { username: string; score: number; streak: number };

export default function Leaderboard({ currentUser }: { currentUser?: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then(r => r.json())
      .then((data: Entry[]) => {
        setEntries(data);
      })
      .catch(() => setEntries([
        { username: 'demo_user', score: 120, streak: 5 },
        { username: 'puzzle_fan', score: 95, streak: 3 },
        { username: 'riddlemaster', score: 80, streak: 2 },
        { username: 'cascade_pro', score: 65, streak: 4 },
        { username: 'daily_solver', score: 50, streak: 1 },
      ]));
  }, []);

  return (
    <div className="leaderboard">
      <h3>Leaderboard</h3>
      {entries.length === 0 ? (
        <p className="leaderboard-empty">No players yet. Be the first!</p>
      ) : (
        <ol>
          {entries.map((e, i) => {
            const isYou = currentUser && e.username === currentUser;
            return (
              <li
                key={e.username}
                className={`rank-row${i === 0 ? ' first' : ''}${isYou ? ' you' : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="rank">#{i + 1}</span>
                <span className="name">{e.username}{isYou ? ' (You)' : ''}</span>
                <span className="score">{e.score} pts</span>
                <span className="streak">🔥 {e.streak}</span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
