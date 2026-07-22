import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MECHANICS = ['pattern', 'wordchain', 'logicgrid', 'emojimath', 'numberpath'];

function pickMechanic(day) {
  return MECHANICS[(day - 1) % MECHANICS.length];
}

async function scrapeThemes() {
  const themes = [];
  try {
    const res = await fetch('https://www.reddit.com/r/all/hot.json?limit=15', {
      headers: { 'User-Agent': 'CascadeDevvitGame/1.0 (by /u/AgenticDaily)' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const posts = data.data?.children ?? [];
    for (const p of posts) {
      const title = p.data?.title;
      if (typeof title === 'string' && title.length >= 10 && title.length <= 100) {
        themes.push(title);
      }
    }
  } catch {
    themes.push(
      'space exploration',
      'retro gaming',
      'baking bread',
      'street art',
      'DIY robotics',
      'mountain hiking',
      'jazz music',
      'ancient history'
    );
  }
  return themes.slice(0, 15);
}

function generatePuzzle(day, themes) {
  const mechanic = pickMechanic(day);
  const theme = themes[day % themes.length] || 'daily challenge';
  const seed = theme;

  switch (mechanic) {
    case 'pattern': {
      const start = 2 + ((day * 3) % 5) * 2;
      return {
        day,
        mechanic: 'pattern',
        prompt: `What comes next? ${start}, ${start * 2}, ${start * 4}, ${start * 8}, ?`,
        answer: String(start * 16),
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

async function main() {
  console.log('Scraping themes...');
  const themes = await scrapeThemes();
  console.log(`Found ${themes.length} themes`);

  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const outputDir = path.join(__dirname, '..', 'puzzles');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (let day = 1; day <= 5; day++) {
    const puzzle = generatePuzzle(day, themes);
    const filePath = path.join(outputDir, `${dateStr}-day${day}.json`);
    fs.writeFileSync(filePath, JSON.stringify(puzzle, null, 2));
    console.log(`Generated day ${day}: ${puzzle.mechanic} -> ${filePath}`);
  }

  console.log('Done generating demo puzzles.');
}

main().catch((err) => {
  console.error('Generation failed:', err);
  process.exit(1);
});
