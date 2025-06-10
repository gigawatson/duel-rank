export interface Item {
  id: string
  label: string
  createdAt: number
}

export interface Game {
  id: string
  itemA: string
  itemB: string
  winner?: string
  skipped?: boolean
  timestamp?: number
}

export interface List {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  items: Item[]
  games: Game[]
  log: string[]
}

export interface RankingEntry {
  id: string
  rank: number
  confidence: number
}

export type GameResult = 'A' | 'B' | 'skip'