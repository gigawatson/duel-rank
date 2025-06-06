/**
 * Composable for handling comparison logic and game state
 */

import { ref, computed, watch } from 'vue'
import type { GameResult } from '../types'
import { buildComparisonGraph, getAllItemPairs, isResolved, calculateRanking } from '../ranking'
import { useListStore } from '../stores/useListStore'

/**
 * Manages the comparison/ranking game state and logic
 */
export function useComparison() {
  const store = useListStore()
  
  // Reactive state
  const comparing = ref(false)
  const refining = ref(false)
  const currentGame = ref<[string, string] | null>(null)
  const log = ref<string[]>([])
  

  // Computed properties
  const list = computed(() => store.list)
  const ranking = computed(() => calculateRanking(list.value))

  /**
   * Calculates remaining pairs that need comparison
   */
  const remainingPairs = computed(() => {
    const pairs = getAllItemPairs(list.value.items)
    let remaining = 0
    
    for (const [a, b] of pairs) {
      const compared = list.value.games.some(g =>
        ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
        (refining.value ? g.winner : (g.winner || g.skipped))
      )
      if (!compared) {
        remaining++
      }
    }
    return remaining
  })

  /**
   * Calculates completion statistics for the comparison process
   */
  const stats = computed(() => {
    const total = (list.value.items.length * (list.value.items.length - 1)) / 2
    const completed = list.value.games.filter(g => (g.winner || g.skipped)).length
    return {
      total,
      completed,
      percent: Math.round((completed / total) * 100) || 0
    }
  })

  /**
   * Checks if any comparisons have been made
   */
  const hasAnyComparisons = computed(() => {
    return list.value.games.some(g => g.winner || g.skipped)
  })

  /**
   * Checks if comparisons are truly complete (not just no games to show)
   */
  const isComparisonComplete = computed(() => {
    // Don't reference currentGame here to avoid circular dependency
    const pairs = getAllItemPairs(list.value.items)
    if (pairs.length === 0) return false
    
    const graph = buildComparisonGraph(list.value.games)
    
    // Check if all pairs are either directly compared or resolved transitively
    for (const [a, b] of pairs) {
      const directlyCompared = list.value.games.some(g =>
        ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
        (g.winner || g.skipped)
      )
      
      if (!directlyCompared && !isResolved(graph, a, b)) {
        return false // Still have unresolved pairs
      }
    }
    
    return hasAnyComparisons.value // Only complete if we've made comparisons
  })

  /**
   * Finds the next pair of items that need comparison
   */
  const updateGame = () => {
    const pairs = getAllItemPairs(list.value.items)
    const unresolvedPairs: [string, string][] = []
    
    // If no items, nothing to compare
    if (pairs.length === 0) {
      currentGame.value = null
      return
    }
    
    // If we're refining, we need to find pairs that haven't been directly compared
    if (refining.value) {
      for (const [a, b] of pairs) {
        const compared = list.value.games.some(g =>
          ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
          g.winner
        )
        if (!compared) {
          unresolvedPairs.push([a, b])
        }
      }
    } else {
      // For initial comparisons, use transitive closure to minimize comparisons
      // But if no games exist yet, we need to start with the first pair
      if (list.value.games.length === 0) {
        // No games yet, just take the first pair
        unresolvedPairs.push(pairs[0])
      } else {
        // Use transitive closure to find unresolved pairs
        const graph = buildComparisonGraph(list.value.games)
        
        for (const [a, b] of pairs) {
          const directlyCompared = list.value.games.some(g =>
            ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
            (g.winner || g.skipped)
          )
          
          // Include this pair if it hasn't been directly compared AND can't be resolved transitively
          if (!directlyCompared && !isResolved(graph, a, b)) {
            unresolvedPairs.push([a, b])
          }
        }
      }
    }
    
    currentGame.value = unresolvedPairs[0] || null
  }

  /**
   * Gets the display label for an item by its ID
   * @param id - Item ID to look up
   * @returns Item label or ID if not found
   */
  const labelFor = (id: string): string => {
    return list.value.items.find(i => i.id === id)?.label || id
  }

  /**
   * Checks if an item has been directly compared against all others
   * @param id - Item ID to check
   * @returns True if item is fully confirmed through direct comparisons
   */
  const isDirectlyConfirmed = (id: string): boolean => {
    const ids = list.value.items.map(i => i.id)
    for (const other of ids) {
      if (id === other) continue
      const compared = list.value.games.some(g =>
        ((g.itemA === id && g.itemB === other) || (g.itemA === other && g.itemB === id)) &&
        g.winner
      )
      if (!compared) return false
    }
    return true
  }

  /**
   * Records a comparison result and updates the game state
   * @param winner - ID of the winning item
   */
  const choose = (winner: string) => {
    if (!currentGame.value) return
    
    const [a, b] = currentGame.value
    const result: GameResult = winner === a ? 'A' : 'B'
    
    store.recordGame(a, b, result)
    log.value.unshift(`${labelFor(a)} vs ${labelFor(b)} → winner: ${labelFor(winner)}`)
    updateGame()
  }

  /**
   * Skips the current comparison
   */
  const skip = () => {
    if (!currentGame.value) return
    
    const [a, b] = currentGame.value
    store.recordGame(a, b, 'skip')
    log.value.unshift(`${labelFor(a)} vs ${labelFor(b)} → skipped`)
    updateGame()
  }

  /**
   * Toggles between list management and comparison modes
   */
  const toggleComparing = () => {
    comparing.value = !comparing.value
    refining.value = false
    if (comparing.value) {
      updateGame()
    }
  }

  /**
   * Starts the refining process to get more precise rankings
   */
  const startRefining = () => {
    refining.value = true
    updateGame()
  }

  // Watch for list changes and update game accordingly
  watch(() => store.activeListId, () => {
    if (comparing.value) {
      updateGame()
    }
  })

  return {
    // State  
    comparing,
    refining,
    currentGame,
    log,
    
    // Computed
    list,
    ranking,
    remainingPairs,
    stats,
    hasAnyComparisons,
    isComparisonComplete,
    
    // Methods
    choose,
    skip,
    toggleComparing,
    startRefining,
    labelFor,
    isDirectlyConfirmed
  }
}