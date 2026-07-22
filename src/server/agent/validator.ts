import { Puzzle } from './generator';

const VALID_MECHANICS: Puzzle['mechanic'][] = [
  'pattern',
  'wordchain',
  'logicgrid',
  'emojimath',
  'numberpath',
];

export function validatePuzzle(puzzle: Puzzle): boolean {
  if (typeof puzzle.day !== 'number' || puzzle.day < 1) return false;
  if (typeof puzzle.mechanic !== 'string' || !VALID_MECHANICS.includes(puzzle.mechanic)) return false;
  if (typeof puzzle.prompt !== 'string' || puzzle.prompt.length < 10 || puzzle.prompt.length > 200) return false;
  if (typeof puzzle.answer !== 'string' || puzzle.answer.length === 0 || puzzle.answer.length >= 50) return false;
  if (!Array.isArray(puzzle.hints) || puzzle.hints.length !== 2) return false;
  for (const h of puzzle.hints) {
    if (typeof h !== 'string' || h.length === 0) return false;
  }
  if (typeof puzzle.seed !== 'string' || puzzle.seed.length === 0) return false;
  return true;
}
