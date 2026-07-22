export type Puzzle = {
  day: number;
  mechanic: 'pattern' | 'wordchain' | 'logicgrid' | 'emojimath' | 'numberpath';
  prompt: string;
  answer: string;
  hints: string[];
  seed: string;
};

const MECHANICS: Puzzle['mechanic'][] = [
  'pattern',
  'wordchain',
  'logicgrid',
  'emojimath',
  'numberpath',
];

function pickMechanic(day: number): Puzzle['mechanic'] {
  return MECHANICS[day % MECHANICS.length];
}

export async function generatePuzzle(day: number, themes: string[]): Promise<Puzzle> {
  const mechanic = pickMechanic(day);
  const theme = themes[day % themes.length] || 'daily challenge';
  const seed = theme;

  switch (mechanic) {
    case 'pattern': {
      const start = 2 + ((day * 3) % 5) * 2;
      const a = start;
      const b = start * 2;
      const c = start * 4;
      const d = start * 8;
      const answer = String(start * 16);
      return {
        day,
        mechanic: 'pattern',
        prompt: `What comes next? ${a}, ${b}, ${c}, ${d}, ?`,
        answer,
        hints: ['Each number doubles the previous one.', 'Think powers of 2.'],
        seed,
      };
    }
    case 'wordchain': {
      const word = theme.split(' ')[0].toLowerCase();
      return {
        day,
        mechanic: 'wordchain',
        prompt: `What single word connects these clues about "${theme}"?`,
        answer: word,
        hints: ['It is the main topic.', 'Look at the first word of the theme.'],
        seed,
      };
    }
    case 'logicgrid': {
      const isYes = day % 2 === 0;
      return {
        day,
        mechanic: 'logicgrid',
        prompt: isYes
          ? 'If A > B and B > C, is A > C? Answer yes or no.'
          : 'If A < B and B < C, is A > C? Answer yes or no.',
        answer: isYes ? 'yes' : 'no',
        hints: ['Consider the relationship between A and C.', 'Think about transitivity.'],
        seed,
      };
    }
    case 'emojimath': {
      const emojis = ['🍎', '⭐', '🔥', '💎', '🎵'];
      const emoji = emojis[day % emojis.length];
      const a = 2 + (day % 4);
      const b = 2 + (day % 3);
      return {
        day,
        mechanic: 'emojimath',
        prompt: `${emoji} + ${emoji} + ${emoji} = ${3 * a}. What is ${emoji} × ${b}?`,
        answer: String(a * b),
        hints: ['Solve for the emoji first.', 'Then multiply.'],
        seed,
      };
    }
    case 'numberpath': {
      const base = 1 + (day % 5);
      const steps = 2 + (day % 4);
      const target = base + 3 * steps;
      return {
        day,
        mechanic: 'numberpath',
        prompt: `Start at ${base}. Add 3 or subtract 1 each step. Minimum steps to reach exactly ${target}?`,
        answer: String(steps),
        hints: ['Each +3 move gets you closer.', 'Use only +3 moves to minimize steps.'],
        seed,
      };
    }
  }
}
