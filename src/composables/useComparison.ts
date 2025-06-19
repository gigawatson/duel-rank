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
  const currentGame = ref<[string, string] | null>(null)
  
  // Computed properties from store
  const refining = computed(() => store.isRefining)
  

  // Computed properties
  const list = computed(() => store.list)
  const ranking = computed(() => calculateRanking(list.value))
  const log = computed(() => list.value.log || [])

  /**
   * Calculates remaining pairs that need comparison based on the same logic as updateGame
   */
  const remainingPairs = computed(() => {
    const pairs = getAllItemPairs(list.value.items)
    let remaining = 0
    
    if (refining.value) {
      // In refining mode: count pairs that haven't been directly compared with winners
      for (const [a, b] of pairs) {
        const compared = list.value.games.some(g =>
          ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
          g.winner && !g.skipped
        )
        if (!compared) {
          remaining++
        }
      }
    } else {
      // In initial mode: count pairs that haven't been directly compared AND can't be resolved transitively
      if (list.value.games.length === 0) {
        remaining = pairs.length
      } else {
        const graph = buildComparisonGraph(list.value.games)
        
        for (const [a, b] of pairs) {
          const directlyCompared = list.value.games.some(g =>
            ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
            (g.winner || g.skipped)
          )
          
          // Count this pair if it hasn't been directly compared AND can't be resolved transitively
          if (!directlyCompared && !isResolved(graph, a, b)) {
            remaining++
          }
        }
      }
    }
    
    return remaining
  })

  /**
   * Calculates completion statistics for the comparison process
   */
  const stats = computed(() => {
    const total = (list.value.items.length * (list.value.items.length - 1)) / 2
    const completed = list.value.games.filter(g => g.winner && !g.skipped).length
    const skipped = list.value.games.filter(g => g.skipped).length
    return {
      total,
      completed,
      skipped,
      percent: Math.round((completed / total) * 100) || 0
    }
  })

  /**
   * Checks if any comparisons have been made
   */
  const hasAnyComparisons = computed(() => {
    return list.value.games.some(g => g.winner && !g.skipped)
  })

  /**
   * Checks if comparisons are truly complete (not just no games to show)
   * For "100% fully ranked! All items directly compared." we need ALL pairs to be directly compared with winners
   */
  const isComparisonComplete = computed(() => {
    const pairs = getAllItemPairs(list.value.items)
    if (pairs.length === 0) return false
    
    // Check if ALL pairs have been directly compared with actual winners (no skips, no transitive inference)
    for (const [a, b] of pairs) {
      const directlyCompared = list.value.games.some(g =>
        ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
        g.winner && !g.skipped
      )
      
      if (!directlyCompared) {
        return false // This pair hasn't been directly compared with a winner
      }
    }
    
    return hasAnyComparisons.value // Only complete if we've made comparisons
  })

  /**
   * Checks if we have a workable initial ranking (using transitive closure)
   * This is different from complete - it means we can produce a ranking but it might not be fully direct
   */
  const hasWorkableRanking = computed(() => {
    const pairs = getAllItemPairs(list.value.items)
    if (pairs.length === 0) return false
    
    const graph = buildComparisonGraph(list.value.games)
    
    // Check if all pairs are either directly compared or resolved transitively
    for (const [a, b] of pairs) {
      const directlyCompared = list.value.games.some(g =>
        ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
        g.winner && !g.skipped
      )
      
      if (!directlyCompared && !isResolved(graph, a, b)) {
        return false // Still have unresolved pairs
      }
    }
    
    return hasAnyComparisons.value
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
        
        // First, find pairs that haven't been compared at all and can't be resolved
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
        
        // If no unresolved pairs but we don't have a workable ranking, re-present skipped pairs
        if (unresolvedPairs.length === 0 && !hasWorkableRanking.value) {
          for (const [a, b] of pairs) {
            const wasSkipped = list.value.games.some(g =>
              ((g.itemA === a && g.itemB === b) || (g.itemA === b && g.itemB === a)) &&
              g.skipped
            )
            
            // Re-present skipped pairs that are still unresolved
            if (wasSkipped && !isResolved(graph, a, b)) {
              unresolvedPairs.push([a, b])
            }
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
    const loser = winner === a ? labelFor(b) : labelFor(a)
    store.addLogEntry(`${labelFor(winner)} beat ${loser}`)
    updateGame()
  }

  /**
   * Skips the current comparison
   */
  const skip = () => {
    if (!currentGame.value) return
    
    const [a, b] = currentGame.value
    store.recordGame(a, b, 'skip')
    store.addLogEntry(`${labelFor(a)} vs ${labelFor(b)} (skipped)`)
    updateGame()
  }

  /**
   * Toggles between list management and comparison modes
   */
  const toggleComparing = () => {
    comparing.value = !comparing.value
    store.stopRefining()
    if (comparing.value) {
      updateGame()
    }
  }

  /**
   * Starts the refining process to get more precise rankings
   */
  const startRefining = () => {
    store.startRefining()
    updateGame()
  }

  /**
   * Checks if we should automatically exit refining mode
   * (when undoing comparisons brings us back to incomplete initial state)
   */
  const checkAndExitRefining = () => {
    // Only check if we're currently in refining mode
    if (refining.value) {
      // If the initial ranking is no longer complete, exit refining mode
      if (!isComparisonComplete.value) {
        store.stopRefining()
      }
    }
  }

  /**
   * Undoes the last comparison and updates the game state
   */
  const undoLastComparison = () => {
    const success = store.undoLastAction()
    if (success) {
      // Remove the last log entry
      store.removeLastLogEntry()
      // Check if we should exit refining mode
      checkAndExitRefining()
      // Update the current game
      updateGame()
    }
    return success
  }

  /**
   * Undoes a specific comparison by gameId
   */
  const undoComparison = (gameId: string) => {
    const success = store.undoAction(gameId)
    if (success) {
      // Rebuild log from current games state instead of trying to find and remove entries
      store.rebuildLogFromGames()
      // Check if we should exit refining mode
      checkAndExitRefining()
      // Update the current game
      updateGame()
    }
    return success
  }

  /**
   * Checks if a specific comparison can be undone
   */
  const canUndoComparison = (gameId: string): boolean => {
    return store.actionHistory.some(action => 
      action.gameId === gameId && 
      action.listId === store.activeListId &&
      action.type === 'comparison'
    )
  }

  /**
   * Checks if undo is available
   */
  const canUndo = computed((): boolean => {
    if (!store.lastAction || store.lastAction.type !== 'comparison') {
      return false
    }
    
    // Check if the lastAction is for the current active list
    if (store.lastAction.listId !== store.activeListId) {
      return false
    }
    
    // Check if the game referenced by lastAction still exists in the current list
    const { gameId } = store.lastAction
    const game = list.value.games.find(g => g.id === gameId)
    
    // Verify the game exists and has been completed (has winner or was skipped)
    return !!(game && (game.winner || game.skipped))
  })


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
    canUndo,
    list,
    ranking,
    remainingPairs,
    stats,
    hasAnyComparisons,
    isComparisonComplete,
    hasWorkableRanking,
    
    // Methods
    choose,
    skip,
    toggleComparing,
    startRefining,
    undoLastComparison,
    undoComparison,
    canUndoComparison,
    labelFor,
    isDirectlyConfirmed
  }
}