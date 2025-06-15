<!--
  ComparisonLog Component
  
  Enhanced visual log of recent comparisons with rich interactions.
-->
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center space-x-2">
        <span class="w-2 h-2 bg-green-500 rounded-full"></span>
        <span>Recent Comparisons</span>
      </h2>
      <div v-if="log.length > 0" class="text-xs text-gray-500">
        {{ log.length }} {{ log.length === 1 ? 'comparison' : 'comparisons' }}
      </div>
    </div>
    
    <div v-if="log.length > 0" class="space-y-2 max-h-64 overflow-y-auto p-4 border border-gray-200 rounded-l-lg">
      <div 
        v-for="(entry, index) in log" 
        :key="index"
        class="group bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
        :class="{ 'bg-blue-50 border-blue-200': index === 0 }"
      >
        <div class="flex items-center justify-between">
          <!-- Comparison Details -->
          <div class="flex items-center space-x-3 flex-1 min-w-0">
            <!-- Result Icon -->
            <div class="flex-shrink-0">
              <div v-if="entry.includes('skipped')" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4 text-gray-700">
                  <path d="M2.53 3.956A1 1 0 0 0 1 4.804v6.392a1 1 0 0 0 1.53.848l5.113-3.196c.16-.1.279-.233.357-.383v2.73a1 1 0 0 0 1.53.849l5.113-3.196a1 1 0 0 0 0-1.696L9.53 3.956A1 1 0 0 0 8 4.804v2.731a.992.992 0 0 0-.357-.383L2.53 3.956Z" />
                </svg>
              </div>
              <div v-else class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4 text-green-700">
                  <path fill-rule="evenodd" d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            
            <!-- Comparison Text -->
            <div class="flex-1 min-w-0">
              <div class="text-sm text-gray-800 font-medium">
                {{ formatComparisonText(entry) }}
              </div>
              <div class="text-xs text-gray-500 mt-0.5">
                {{ getTimeAgo(index) }}
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="index === 0 && canUndo"
              @click="$emit('undo')"
              class="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Undo this comparison"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              <span>Undo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Empty State -->
    <div v-else class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-8 text-center">
      <div class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2H14m-5 0V3a1 1 0 011-1h3a1 1 0 011 1v2m-5 0h5m-5 4h5m-5 4h5"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-emerald-800 mb-2">Ready to track your decisions</h4>
          <p class="text-emerald-600 max-w-md mx-auto">
            Your comparison history will appear here as you make choices. Each decision helps build a more accurate ranking.
          </p>
        </div>
        <div class="text-xs text-emerald-500 border-t border-emerald-200 pt-4">
          <p>💡 Start comparing items to see your decision trail!</p>
        </div>
      </div>
    </div>
    
    <!-- Actions Bar -->
    <div v-if="log.length > 5" class="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
      <div class="text-xs text-gray-500">
        Showing recent {{ Math.min(log.length, 20) }} comparisons
      </div>
      <button 
        @click="$emit('clearLog')"
        class="text-xs text-red-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
      >
        Clear all
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the ComparisonLog component
 */
interface Props {
  log: readonly string[]  // Array of log entries
  canUndo?: boolean  // Whether undo is available for the latest entry
}

/**
 * Events emitted by the ComparisonLog component
 */
interface Emits {
  clearLog: []  // When user wants to clear the log
  undo: []  // When user wants to undo the latest comparison
}

defineProps<Props>()
defineEmits<Emits>()

/**
 * Formats the raw log entry text into a more readable format
 */
const formatComparisonText = (entry: string): string => {
  if (entry.includes('skipped')) {
    // "Pizza vs Burger → skipped" -> "Pizza vs Burger (skipped)"
    return entry.replace(' → skipped', ' (skipped)')
  } else {
    // "Pizza vs Burger → winner: Pizza" -> "Pizza beat Burger"
    const match = entry.match(/(.+) vs (.+) → winner: (.+)/)
    if (match) {
      const [, itemA, itemB, winner] = match
      return `${winner} beat ${winner === itemA ? itemB : itemA}`
    }
  }
  return entry
}

/**
 * Gets relative time for a log entry based on its position
 */
const getTimeAgo = (index: number): string => {
  if (index === 0) return 'just now'
  if (index === 1) return '1 comparison ago'
  return `${index} comparisons ago`
}
</script>