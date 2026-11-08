export const WORD_SEARCH_SIZE: number
export const WORD_SEARCH_COUNT: number
export const WORD_SEARCH_CATEGORIES: Record<string, string>

export type WordSearchFoundWord = {
  word: string
  cells: number[]
  slot: number
  points: number
}

export type WordSearchMatch = {
  size: number
  category: string
  grid: string[]
  placements: Array<{ word: string; cells: number[] }>
  words: string[]
  found: WordSearchFoundWord[]
  scores: [number, number]
  foundCounts: [number, number]
  status: 'playing' | 'finished'
  winner: number | null
  startedAt: number
  elapsedSeconds: number
}

export function createWordSearchMatch(
  seed: number,
  now?: number,
  category?: string,
  count?: number,
): WordSearchMatch
export function findWordSearchPath(
  state: WordSearchMatch,
  start: number,
  end: number,
): { word: string; cells: number[]; points: number } | null
export function submitWordSearchWord(
  state: WordSearchMatch,
  slot: number,
  start: number,
  end: number,
): { ok: boolean; error?: string; word?: string; points?: number }
export function tickWordSearchMatch(state: WordSearchMatch, now?: number): WordSearchMatch
