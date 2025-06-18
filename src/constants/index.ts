export const VALIDATION_MESSAGES = {
  EMPTY_ITEM: 'Item name cannot be empty.',
  DUPLICATE_ITEM: 'An item with this name already exists.',
  EMPTY_LIST: 'List name cannot be empty.',
  DUPLICATE_LIST: 'A list with this name already exists.'
} as const

export const STORAGE_KEYS = {
  LISTS: 'duel-ranker-lists',
  ACTIVE_LIST_ID: 'duel-ranker-active-list-id',
  REFINING_STATES: 'duel-ranker-refining-states',
  LAST_ACTION: 'duel-ranker-last-action'
} as const

export const ID_SEPARATORS = {
  LIST: '-',
  ITEM: '-',
  GAME: '-'
} as const