export type Puzzle = {
  day: number;
  mechanic: 'pattern' | 'wordchain' | 'logicgrid' | 'emojimath' | 'numberpath';
  prompt: string;
  answer: string;
  hints: string[];
  seed: string;
};

const MECHANICS: Puzzle['mechanic'][] = ['pattern', 'wordchain', 'logicgrid', 'emojimath', 'numberpath'];

function pickMechanic(day: number): Puzzle['mechanic'] {
  return MECHANICS[(day - 1) % MECHANICS.length];
}

export async function generatePuzzle(day: number, themes: string[]): Promise<Puzzle> {
  const mechanic = pickMechanic(day);
  const seed = themes[day % themes.length] || 'daily challenge';

  const templates: Record<Puzzle['mechanic'], Omit<Puzzle, 'day' | 'seed'>> = {
    pattern: {
      mechanic: 'pattern',
      prompt: `What comes next in this pattern? (theme: ${seed})`,
      answer: '32',
      hints: ['Each number doubles the previous one.', 'Think powers of 2.'],
    },
    wordchain: {
      mechanic: 'wordchain',
      prompt: `Find the word that connects these clues related to "${seed}".`,
      answer: 'bridge',
      hints: ['It spans something.', 'It connects two sides.'],
    },
    logicgrid: {
      mechanic: 'logicgrid',
      prompt: `Logic grid: If A > B and B < C, is A > C? Answer yes/no.`,
      answer: 'no',
      hints: ['Not enough information.', 'A and C could be anything.'],
    },
    emojimath: {
      mechanic: 'emojimath',
      prompt: `🍎 + 🍎 + 🍎 = 15. What is 🍎 × 2?`,
      answer: '10',
      hints: ['Each apple is 5.', '5 times 2.'],
    },
    numberpath: {
      mechanic: 'numberpath',
      prompt: `Move from 1 to 10 using only +3 or -1. What is the step before reaching 10?`,
      answer: '7',
      hints: ['Work backwards.', '10 - 3 = 7.'],
    },
  };

  return {
    day,
    ...templates[mechanic],
    seed,
  };
}
