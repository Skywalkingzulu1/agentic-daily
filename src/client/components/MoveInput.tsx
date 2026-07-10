import { useState } from 'react';

export default function MoveInput() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitted' | 'correct' | 'wrong'>('idle');

  const submit = async () => {
    if (!answer.trim()) return;
    setStatus('submitted');
    try {
      const res = await fetch('/api/puzzle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      const data = await res.json();
      setStatus(data.correct ? 'correct' : 'wrong');
      if (data.correct) {
        setAnswer('');
      }
    } catch {
      setStatus('wrong');
    }
  };

  return (
    <div className="move-input">
      <label htmlFor="answer">Your Answer</label>
      <div className="move-row">
        <input
          id="answer"
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          placeholder="Type your answer..."
          onKeyDown={e => e.key === 'Enter' && submit()}
        />
        <button onClick={submit} disabled={status === 'submitted'}>
          {status === 'submitted' ? '...' : 'Send'}
        </button>
      </div>
      {status === 'correct' && <p className="status-correct">Correct! +10 points</p>}
      {status === 'wrong' && <p className="status-wrong">Not quite — try again or check the hints</p>}
    </div>
  );
}
