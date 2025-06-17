import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import type { Game, List } from '../types'
import { STORAGE_KEYS, ID_SEPARATORS } from '../constants'

function createEmptyList(name: string): List {
    const now = Date.now()
    return {
        id: name.toLowerCase().replace(/\s+/g, ID_SEPARATORS.LIST) + ID_SEPARATORS.LIST + now,
        name,
        createdAt: now,
        updatedAt: now,
        items: [],
        games: [],
        log: []
    }
}

export const useListStore = defineStore('list', {
    state: () => ({
        lists: useStorage<List[]>(STORAGE_KEYS.LISTS, []),
        activeListId: useStorage<string>(STORAGE_KEYS.ACTIVE_LIST_ID, ''),
        actionHistory: useStorage<{ type: 'comparison', gameId: string, listId: string, previousState?: any, timestamp: number }[]>(STORAGE_KEYS.LAST_ACTION, [], localStorage, {
            serializer: {
                read: (v: any) => {
                    if (!v) return []
                    try {
                        return JSON.parse(v)
                    } catch (e) {
                        console.warn('Failed to parse actionHistory from localStorage, clearing it:', e)
                        return []
                    }
                },
                write: (v: any) => JSON.stringify(v)
            }
        })
    }),
    getters: {
        list(state): List {
            // If no lists exist, return a safe empty list structure
            if (state.lists.length === 0) {
                return createEmptyList('No List')
            }
            // Find active list or fallback to first list
            const list = state.lists.find(l => l.id === state.activeListId) ?? state.lists[0]
            // Ensure backwards compatibility for lists without log property
            if (!list.log) {
                list.log = []
            }
            return list
        },
        allLists(state): List[] {
            // Ensure backwards compatibility for lists without log property
            return state.lists.map(list => {
                if (!list.log) {
                    list.log = []
                }
                return list
            })
        },
        lastAction(state): { type: 'comparison', gameId: string, listId: string, previousState?: any, timestamp: number } | null {
            // Return the most recent action for the current list
            const recentActions = state.actionHistory
                .filter(action => action.listId === state.activeListId)
                .sort((a, b) => b.timestamp - a.timestamp)
            return recentActions[0] || null
        }
    },
    actions: {
        createList(name: string) {
            const newList = createEmptyList(name)
            this.lists.push(newList)
            this.activeListId = newList.id
        },
        switchList(id: string) {
            if (this.lists.find(l => l.id === id)) {
                this.activeListId = id
            }
        },
        deleteList(id: string) {
            this.lists = this.lists.filter(l => l.id !== id)
            if (this.activeListId === id) {
                if (this.lists.length > 0) {
                    this.activeListId = this.lists[0].id
                } else {
                    this.activeListId = ''
                }
            }
        },
        resetList() {
            const index = this.lists.findIndex(l => l.id === this.activeListId)
            if (index !== -1) {
                const name = this.lists[index].name
                const newList = createEmptyList(name)
                this.lists[index] = newList
                this.activeListId = newList.id
                // Clear action history since all games were reset
                this.actionHistory = this.actionHistory.filter(action => action.listId !== this.activeListId)
            }
        },
        resetComparisons() {
            const list = this.list
            if (list) {
                // Keep the list and items, only clear comparison data
                list.games = []
                list.log = []
                list.updatedAt = Date.now()
                // Clear action history for this list since all comparisons were reset
                this.actionHistory = this.actionHistory.filter(action => action.listId !== this.activeListId)
            }
        },
        editListName(id: string, newName: string) {
            const list = this.lists.find(l => l.id === id)
            if (list) {
                list.name = newName
                list.updatedAt = Date.now()
            }
        },
        addItem(label: string) {
            const list = this.list
            list.items.push({
                id: label.toLowerCase() + '-' + Date.now(),
                label,
                createdAt: Date.now()
            })
            list.updatedAt = Date.now()
        },
        editItem(id: string, newLabel: string) {
            const list = this.list
            const item = list.items.find(i => i.id === id)
            if (item) {
                const oldLabel = item.label
                item.label = newLabel
                // Update log entries to reflect the new label
                list.log = list.log.map(entry => 
                    entry.replace(new RegExp(oldLabel, 'g'), newLabel)
                )
                list.updatedAt = Date.now()
            }
        },
        removeItem(id: string) {
            const list = this.list
            const item = list.items.find(i => i.id === id)
            if (item) {
                // Remove the item
                list.items = list.items.filter(i => i.id !== id)
                // Remove games involving this item
                list.games = list.games.filter(g => g.itemA !== id && g.itemB !== id)
                // Remove log entries involving this item
                list.log = list.log.filter(entry => !entry.includes(item.label))
                // Clear action history for actions involving this item
                this.actionHistory = this.actionHistory.filter(action => 
                    !action.gameId.includes(id)
                )
                list.updatedAt = Date.now()
            }
        },
        recordGame(a: string, b: string, result: 'A' | 'B' | 'skip') {
            const winner = result === 'A' ? a : result === 'B' ? b : undefined
            const list = this.list
            const existing = list.games.find(g =>
                (g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)
            )
            
            // Use existing game's ID if it exists, otherwise create new one
            const gameId = existing ? existing.id : `game-${a}-${b}`
            const previousState = existing ? { ...existing } : null
            
            const game: Game = {
                id: gameId,
                itemA: a,
                itemB: b,
                winner,
                skipped: result === 'skip',
                timestamp: Date.now()
            }
            
            if (existing) {
                Object.assign(existing, game)
            } else {
                list.games.push(game)
            }
            
            list.updatedAt = Date.now()
            
            // Track this action for undo
            const action = {
                type: 'comparison' as const,
                gameId,
                listId: this.activeListId,
                previousState,
                timestamp: Date.now()
            }
            
            // Add to history (keep last 20 actions per list)
            this.actionHistory.unshift(action)
            
            // Limit history size and only keep actions for current lists
            const validListIds = this.lists.map(l => l.id)
            this.actionHistory = this.actionHistory
                .filter(action => validListIds.includes(action.listId))
                .slice(0, 20)
        },
        undoLastAction() {
            return this.undoAction(this.lastAction?.gameId)
        },
        undoAction(gameId?: string) {
            if (!gameId) return false
            
            // Find the action in history
            const actionIndex = this.actionHistory.findIndex(action => 
                action.gameId === gameId && 
                action.listId === this.activeListId &&
                action.type === 'comparison'
            )
            
            if (actionIndex === -1) return false
            
            const action = this.actionHistory[actionIndex]
            const list = this.list
            
            if (action.previousState) {
                // Restore the previous state of the game
                const gameIndex = list.games.findIndex(g => g.id === gameId)
                if (gameIndex !== -1) {
                    list.games[gameIndex] = { ...action.previousState }
                }
            } else {
                // Remove the game entirely (it was newly created)
                list.games = list.games.filter(g => g.id !== gameId)
            }
            
            // Remove this action and all newer actions for this game
            // (to prevent inconsistent state)
            this.actionHistory = this.actionHistory.filter((_, index) => index !== actionIndex)
            
            list.updatedAt = Date.now()
            return true
        },
        addLogEntry(entry: string) {
            const list = this.list
            list.log.unshift(entry)
            list.updatedAt = Date.now()
        },
        removeLastLogEntry() {
            const list = this.list
            if (list.log.length > 0) {
                list.log.shift()
                list.updatedAt = Date.now()
            }
        },
        clearLog() {
            const list = this.list
            list.log = []
            list.updatedAt = Date.now()
        }
    }
})
