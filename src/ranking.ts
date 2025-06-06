/**
 * Ranking Algorithm Implementation
 * 
 * This module implements a pairwise comparison ranking system using topological sorting
 * with intelligent tie-breaking. The algorithm builds a directed graph from comparison
 * results and uses transitive closure to infer relationships between items that haven't
 * been directly compared.
 * 
 * Key Features:
 * - Topological sorting with win-count tie-breaking
 * - Transitive closure using Floyd-Warshall algorithm
 * - Confidence scoring based on direct vs inferred relationships
 * - Efficient next-game selection to minimize comparisons needed
 */

import type { Item, Game, List, RankingEntry } from './types'

/**
 * Generates all possible pairs of items for comparison
 * 
 * @param items - Array of items to generate pairs for
 * @returns Array of item ID pairs [a, b] where a comes before b in the original array
 * 
 * Time Complexity: O(n²) where n is the number of items
 * Space Complexity: O(n²) for storing all pairs
 */
export function getAllItemPairs(items: Item[]): [string, string][] {
    const pairs: [string, string][] = []
    for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
            pairs.push([items[i].id, items[j].id])
        }
    }
    return pairs
}

/**
 * Builds a directed comparison graph with transitive closure
 * 
 * Creates a graph where each node represents an item and directed edges represent
 * "beats" relationships. Uses Floyd-Warshall algorithm to compute transitive closure,
 * meaning if A beats B and B beats C, then A transitively beats C.
 * 
 * @param games - Array of completed games with winners
 * @returns Graph where graph[winner] contains Set of all items that winner beats
 * 
 * Time Complexity: O(n³) where n is the number of items (due to Floyd-Warshall)
 * Space Complexity: O(n²) for storing the adjacency matrix as sets
 */
export function buildComparisonGraph(games: Game[]): Record<string, Set<string>> {
    const graph: Record<string, Set<string>> = {}
    
    // Step 1: Build direct win relationships from completed games
    for (const game of games) {
        // Skip games without winners or that were skipped
        if (!game.winner || game.skipped) continue
        
        const loser = game.itemA === game.winner ? game.itemB : game.itemA
        if (!graph[game.winner]) graph[game.winner] = new Set()
        graph[game.winner].add(loser)
    }
    
    // Step 2: Collect all items that have participated in games
    const allItems = new Set<string>()
    for (const game of games) {
        allItems.add(game.itemA)
        allItems.add(game.itemB)
    }
    
    // Step 3: Initialize empty sets for items that haven't won any games
    for (const item of allItems) {
        if (!graph[item]) graph[item] = new Set()
    }
    
    // Step 4: Compute transitive closure using Floyd-Warshall algorithm
    // For each potential intermediate item k, check if it creates new transitive relationships
    for (const k of allItems) {
        for (const i of allItems) {
            // If item i beats item k
            if (graph[i].has(k)) {
                // Then item i also beats everything that k beats
                for (const j of graph[k]) {
                    graph[i].add(j)
                }
            }
        }
    }
    
    return graph
}

/**
 * Checks if the relationship between two items has been resolved
 * 
 * Two items are considered resolved if one beats the other either directly
 * (through a game) or transitively (through the comparison graph).
 * 
 * @param graph - Comparison graph with transitive closure
 * @param a - First item ID
 * @param b - Second item ID
 * @returns True if relationship between a and b is known
 */
export function isResolved(graph: Record<string, Set<string>>, a: string, b: string): boolean {
    return graph[a]?.has(b) || graph[b]?.has(a)
}


/**
 * Computes confidence score for an item's ranking position
 * 
 * Confidence represents how well-established an item's position is based on
 * the number of resolved relationships (direct or transitive) with other items.
 * 
 * @param id - Item ID to compute confidence for
 * @param graph - Comparison graph with transitive closure
 * @param allIds - Array of all item IDs in the ranking
 * @returns Confidence score between 0 and 1
 */
function computeConfidence(id: string, graph: Record<string, Set<string>>, allIds: string[]): number {
    let known = 0
    
    // Count how many relationships with other items are known
    for (const other of allIds) {
        if (id === other) continue
        if (graph[id]?.has(other) || graph[other]?.has(id)) {
            known++
        }
    }
    
    // Return proportion of known relationships, rounded to 2 decimal places
    return +(known / (allIds.length - 1)).toFixed(2)
}

/**
 * Calculates the ranking of items using topological sort with intelligent tie-breaking
 * 
 * This is the core ranking algorithm that processes comparison results to produce
 * a ranked list of items. The algorithm works by:
 * 
 * 1. Building a comparison graph with transitive relationships
 * 2. Counting wins and losses for each item
 * 3. Using topological sort to determine order
 * 4. Breaking ties using win counts, then loss counts, then alphabetically
 * 5. Computing confidence scores based on relationship completeness
 * 
 * @param list - List containing items and completed games
 * @returns Array of ranking entries sorted from best (rank 0) to worst
 * 
 * Time Complexity: O(n³ + g) where n is items and g is games
 * Space Complexity: O(n²) for the comparison graph
 */
export function calculateRanking(list: List): RankingEntry[] {
    const ids = list.items.map(i => i.id)
    if (ids.length === 0) return []
    
    const graph = buildComparisonGraph(list.games)
    
    // Calculate win counts for each item
    const winCounts: Record<string, number> = {}
    const lossCounts: Record<string, number> = {}
    
    // Initialize counts
    for (const id of ids) {
        winCounts[id] = 0
        lossCounts[id] = 0
    }
    
    // Count direct wins and losses
    for (const game of list.games) {
        if (game.winner && !game.skipped) {
            winCounts[game.winner] = (winCounts[game.winner] || 0) + 1
            const loser = game.itemA === game.winner ? game.itemB : game.itemA
            lossCounts[loser] = (lossCounts[loser] || 0) + 1
        }
    }
    
    // Use topological sort with tie-breaking by win count
    const inDegree: Record<string, number> = {}
    
    // Initialize in-degrees
    for (const id of ids) {
        inDegree[id] = 0
    }
    
    // Calculate in-degrees from direct comparisons only
    for (const game of list.games) {
        if (game.winner && !game.skipped) {
            const loser = game.itemA === game.winner ? game.itemB : game.itemA
            inDegree[loser] = (inDegree[loser] || 0) + 1
        }
    }
    
    const result: string[] = []
    const remaining = new Set(ids)
    
    while (remaining.size > 0) {
        // Find all items with minimum in-degree among remaining items
        const minInDegree = Math.min(...Array.from(remaining).map(id => inDegree[id]))
        const candidates = Array.from(remaining).filter(id => inDegree[id] === minInDegree)
        
        // If multiple candidates, sort by win count (descending), then by loss count (ascending)
        candidates.sort((a, b) => {
            const winDiff = (winCounts[b] || 0) - (winCounts[a] || 0)
            if (winDiff !== 0) return winDiff
            
            const lossDiff = (lossCounts[a] || 0) - (lossCounts[b] || 0)
            if (lossDiff !== 0) return lossDiff
            
            // If still tied, sort by id for consistency
            return a.localeCompare(b)
        })
        
        const next = candidates[0]
        result.push(next)
        remaining.delete(next)
        
        // Update in-degrees for remaining items
        for (const game of list.games) {
            if (game.winner === next && !game.skipped) {
                const loser = game.itemA === next ? game.itemB : game.itemA
                if (remaining.has(loser)) {
                    inDegree[loser] = Math.max(0, inDegree[loser] - 1)
                }
            }
        }
    }
    
    return result.map((id, i) => ({
        id,
        rank: i,
        confidence: computeConfidence(id, graph, ids),
    }))
}

