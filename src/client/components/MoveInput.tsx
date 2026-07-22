import { useState, FormEvent, KeyboardEvent } from 'react';

export default function MoveInput() {
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'correct' | 'wrong'>('idle');
  const [feedback, setFeedback] = useState('');

  const submit = async () => {
    if (!answer.trim() || status === 'submitting') return;
    setStatus('submitting');
    setFeedback('');

    try {
      const res = await fetch('/api/puzzle/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: answer.trim() }),
      });
      const data = await res.json();
      if (data.correct) {
        setStatus('correct');
        setFeedback('Correct! +10 points');
        setAnswer('');
      } else {
        setStatus('wrong');
        setFeedback(data.error || 'Not quite — try again or check the hints');
      }
    } catch {
      setStatus('wrong');
      setFeedback('Network error — please try again');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  const disabled = status === 'submitting';

  return (
    <div className="move-input">
      <label htmlFor="answer">Your Answer</label>
      <div className="move-row">
        <input
          id="answer"
          type="text"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer..."
          disabled={disabled}
          autoComplete="off"
        />
        <button onClick={submit} disabled={disabled}>
          {status === 'submitting' ? '...' : 'Send'}
        </button>
      </div>
      {status === 'correct' && <p className="status-correct">{feedback}</p>}
      {status === 'wrong' && <p className="status-wrong">{feedback}</p>}
    </div>
  );
}
