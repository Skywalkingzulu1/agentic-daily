import { Puzzle } from './generator';

export function validatePuzzle(puzzle: Puzzle): boolean {
  if (!puzzle.prompt || puzzle.prompt.length < 5) return false;
  if (!puzzle.answer || puzzle.answer.length === 0) return false;
  if (!puzzle.hints || puzzle.hints.length === 0) return false;
  if (puzzle.day < 1) return false;
  return true;
}
