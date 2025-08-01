/**
 * Export utilities for rankings data
 * 
 * Provides functions to export ranking data in various formats:
 * - JSON: Complete data with metadata
 * - CSV: Simplified tabular format
 * - Markdown: Human-readable format for sharing
 */

import type { List, RankingEntry } from '../types'
import { calculateRanking } from '../ranking'

export interface ExportData {
  list: List
  ranking: RankingEntry[]
  metadata: {
    exportedAt: string
    totalItems: number
    totalComparisons: number
    averageConfidence: number
  }
}

/**
 * Prepares ranking data for export
 */
export function prepareExportData(list: List, getLabelFn: (id: string) => string): ExportData {
  const ranking = calculateRanking(list)
  const averageConfidence = ranking.length > 0 
    ? ranking.reduce((sum, item) => sum + item.confidence, 0) / ranking.length 
    : 0

  return {
    list: {
      ...list,
      items: list.items.map(item => ({
        ...item,
        label: getLabelFn(item.id)
      }))
    },
    ranking: ranking.map(entry => ({
      ...entry,
      label: getLabelFn(entry.id)
    })) as any,
    metadata: {
      exportedAt: new Date().toISOString(),
      totalItems: list.items.length,
      totalComparisons: list.games.filter(g => g.winner || g.skipped).length,
      averageConfidence: Math.round(averageConfidence * 100) / 100
    }
  }
}

/**
 * Exports ranking data as JSON
 */
export function exportAsJSON(list: List, getLabelFn: (id: string) => string): string {
  const data = prepareExportData(list, getLabelFn)
  return JSON.stringify(data, null, 2)
}

/**
 * Exports ranking data as CSV
 */
export function exportAsCSV(list: List, getLabelFn: (id: string) => string): string {
  const data = prepareExportData(list, getLabelFn)
  const { ranking } = data
  
  // CSV Header
  let csv = 'Rank,Item,Confidence\n'
  
  // Add ranking data
  ranking.forEach(entry => {
    const label = (entry as any).label.replace(/"/g, '""') // Escape quotes
    const confidence = Math.round(entry.confidence * 100)
    csv += `${entry.rank},"${label}",${confidence}%\n`
  })
  
  
  return csv
}

/**
 * Exports ranking data as Markdown
 */
export function exportAsMarkdown(list: List, getLabelFn: (id: string) => string): string {
  const data = prepareExportData(list, getLabelFn)
  const { ranking, metadata } = data
  
  let md = `# ${list.name}\n\n`
  
  // Metadata section
  md += '## Summary\n\n'
  md += `- **Total Items:** ${metadata.totalItems}\n`
  md += `- **Total Comparisons:** ${metadata.totalComparisons}\n`
  md += `- **Average Confidence:** ${Math.round(metadata.averageConfidence * 100)}%\n`
  md += `- **Exported:** ${new Date(metadata.exportedAt).toLocaleString()}\n\n`
  
  // Rankings table
  md += '## Rankings\n\n'
  md += '| Rank | Item | Confidence |\n'
  md += '|------|------|------------|\n'
  
  ranking.forEach(entry => {
    const label = (entry as any).label
    const confidence = Math.round(entry.confidence * 100)
    md += `| ${entry.rank} | ${label} | ${confidence}% |\n`
  })
  
  // Additional details
  if (ranking.length > 0) {
    md += '\n## Details\n\n'
    md += `**Highest Confidence:** ${(ranking as any)[0].label} (${Math.round(ranking[0].confidence * 100)}%)\n\n`
    
    const lowestConfidence = ranking[ranking.length - 1]
    md += `**Lowest Confidence:** ${(lowestConfidence as any).label} (${Math.round(lowestConfidence.confidence * 100)}%)\n\n`
  }
  
  md += '---\n'
  md += '*Generated by [Duel Rank](https://duelr.app)*\n'
  
  return md
}

/**
 * Exports ranking data as a simple numbered list in Markdown
 */
export function exportAsSimple(list: List, getLabelFn: (id: string) => string): string {
  const ranking = calculateRanking(list)
  
  let md = ''
  
  ranking.forEach(entry => {
    const label = getLabelFn(entry.id)
    md += `${entry.rank}. ${label}\n`
  })
  
  return md
}

/**
 * Downloads content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

/**
 * Generates a safe filename based on list name and format
 */
export function generateFilename(listName: string, format: 'json' | 'csv' | 'md' | 'txt'): string {
  const safeName = listName
    .replace(/[^a-zA-Z0-9\s-_]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase()
  
  const timestamp = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const extension = format === 'txt' ? 'txt' : format
  
  return `${safeName}-ranking-${timestamp}.${extension}`
}