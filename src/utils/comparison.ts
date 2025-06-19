/**
 * Comparison utilities for counting and analyzing comparison data
 */

/**
 * Get count of completed comparisons (excluding skipped games)
 * @param list - The list containing games to count
 * @returns Number of completed comparisons
 */
export function getCompletedComparisons(list: { games?: any[] }): number {
  if (!list?.games) return 0
  return list.games.filter((g: any) => g.winner && !g.skipped).length
}

/**
 * Get count of completed comparisons from log entries (excluding skipped)
 * @param logEntries - Array of log entry strings
 * @returns Number of completed comparisons
 */
export function getCompletedComparisonsFromLog(logEntries: readonly string[]): number {
  return logEntries.filter(entry => !entry.includes('skipped')).length
}