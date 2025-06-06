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
        games: []
    }
}

export const useListStore = defineStore('list', {
    state: () => ({
        lists: useStorage<List[]>(STORAGE_KEYS.LISTS, []),
        activeListId: useStorage<string>(STORAGE_KEYS.ACTIVE_LIST_ID, '')
    }),
    getters: {
        list(state): List {
            // If no lists exist, return a safe empty list structure
            if (state.lists.length === 0) {
                return createEmptyList('No List')
            }
            // Find active list or fallback to first list
            return state.lists.find(l => l.id === state.activeListId) ?? state.lists[0]
        },
        allLists(state): List[] {
            return state.lists
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
                    const fallback = createEmptyList('Default')
                    this.lists.push(fallback)
                    this.activeListId = fallback.id
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
                item.label = newLabel
                list.updatedAt = Date.now()
            }
        },
        removeItem(id: string) {
            const list = this.list
            list.items = list.items.filter(i => i.id !== id)
            list.games = list.games.filter(g => g.itemA !== id && g.itemB !== id)
            list.updatedAt = Date.now()
        },
        recordGame(a: string, b: string, result: 'A' | 'B' | 'skip') {
            const winner = result === 'A' ? a : result === 'B' ? b : undefined
            const list = this.list
            const existing = list.games.find(g =>
                (g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)
            )
            const game: Game = {
                id: `game-${a}-${b}`,
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
        }
    }
})
