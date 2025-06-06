/**
 * Composable for handling ranking data export
 */

import { ref } from 'vue'
import type { List } from '../types'
import { 
  exportAsJSON, 
  exportAsCSV, 
  exportAsMarkdown, 
  exportAsSimple,
  downloadFile, 
  generateFilename 
} from '../utils/export'

export type ExportFormat = 'json' | 'csv' | 'markdown' | 'simple'

export function useExport() {
  const isExporting = ref(false)
  const exportError = ref<string | null>(null)

  /**
   * Exports ranking data in the specified format
   */
  const exportRanking = async (
    list: List, 
    format: ExportFormat, 
    getLabelFn: (id: string) => string
  ): Promise<void> => {
    try {
      isExporting.value = true
      exportError.value = null

      let content: string
      let mimeType: string
      let fileExtension: 'json' | 'csv' | 'md' | 'txt'

      switch (format) {
        case 'json':
          content = exportAsJSON(list, getLabelFn)
          mimeType = 'application/json'
          fileExtension = 'json'
          break
        
        case 'csv':
          content = exportAsCSV(list, getLabelFn)
          mimeType = 'text/csv'
          fileExtension = 'csv'
          break
        
        case 'markdown':
          content = exportAsMarkdown(list, getLabelFn)
          mimeType = 'text/markdown'
          fileExtension = 'md'
          break
        
        case 'simple':
          content = exportAsSimple(list, getLabelFn)
          mimeType = 'text/plain'
          fileExtension = 'txt'
          break
        
        default:
          throw new Error(`Unsupported export format: ${format}`)
      }

      const filename = generateFilename(list.name, fileExtension)
      downloadFile(content, filename, mimeType)

    } catch (error) {
      console.error('Export failed:', error)
      exportError.value = error instanceof Error ? error.message : 'Export failed'
    } finally {
      isExporting.value = false
    }
  }

  /**
   * Copies ranking data to clipboard as text
   */
  const copyToClipboard = async (
    list: List, 
    format: ExportFormat, 
    getLabelFn: (id: string) => string
  ): Promise<boolean> => {
    try {
      let content: string

      switch (format) {
        case 'json':
          content = exportAsJSON(list, getLabelFn)
          break
        case 'csv':
          content = exportAsCSV(list, getLabelFn)
          break
        case 'markdown':
          content = exportAsMarkdown(list, getLabelFn)
          break
        case 'simple':
          content = exportAsSimple(list, getLabelFn)
          break
        default:
          throw new Error(`Unsupported format: ${format}`)
      }

      await navigator.clipboard.writeText(content)
      return true
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      exportError.value = 'Failed to copy to clipboard'
      return false
    }
  }

  /**
   * Clears any export errors
   */
  const clearError = () => {
    exportError.value = null
  }

  /**
   * Gets a preview of the export content (first few lines)
   */
  const getPreview = (
    list: List, 
    format: ExportFormat, 
    getLabelFn: (id: string) => string,
    maxLines: number = 10
  ): string => {
    try {
      let content: string

      switch (format) {
        case 'json':
          content = exportAsJSON(list, getLabelFn)
          break
        case 'csv':
          content = exportAsCSV(list, getLabelFn)
          break
        case 'markdown':
          content = exportAsMarkdown(list, getLabelFn)
          break
        case 'simple':
          content = exportAsSimple(list, getLabelFn)
          break
        default:
          return 'Unsupported format'
      }

      const lines = content.split('\n')
      const preview = lines.slice(0, maxLines).join('\n')
      
      if (lines.length > maxLines) {
        return preview + '\n...'
      }
      
      return preview
    } catch (error) {
      return 'Preview unavailable'
    }
  }

  return {
    // State
    isExporting,
    exportError,
    
    // Actions
    exportRanking,
    copyToClipboard,
    clearError,
    getPreview
  }
}