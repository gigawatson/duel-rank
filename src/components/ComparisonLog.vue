<!--
  ComparisonLog Component
  
  Enhanced visual log of recent comparisons with rich interactions.
-->
<template>
  <div class="p-6 border border-gray-300 rounded-xl bg-white">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center space-x-2">
        <span>Comparison History</span>
      </h2>
      <div v-if="log.length > 0" class="text-xs text-gray-500">
        {{ log.length }} {{ log.length === 1 ? 'comparison' : 'comparisons' }}
      </div>
    </div>
    
    <div v-if="log.length > 0" class="space-y-4 max-h-84 overflow-y-auto p-4 bg-gray-50 border border-gray-200 border-r-0 rounded-l-lg">
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
                {{ entry }}
              </div>
              <div class="text-xs text-gray-500 mt-0.5">
                {{ getTimeAgo(index) }}
              </div>
            </div>
          </div>
          
          <!-- Quick Actions -->
          <div class="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              v-if="canUndoEntry(entry)"
              @click="handleUndoClick(entry)"
              class="px-2 py-1 text-xs bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors flex items-center space-x-1 cursor-pointer"
              title="Undo this comparison - This will permanently remove it from your history and update your ranking"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-3">
                <path fill-rule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clip-rule="evenodd" />
              </svg>
              <span>Undo</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Enhanced Empty State -->
    <div v-else class="bg-gradient-to-t from-emerald-50 to-gray-50 border border-green-800/20 inset-ring inset-ring-white rounded-lg p-12 text-center">
      <div class="space-y-4">
        <div class="w-14 h-14 mx-auto bg-gradient-to-br from-emerald-100 to-green-300 ring-1 ring-emerald-300 inset-ring inset-ring-white rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="size-7 text-emerald-800" viewBox="0 0 16 16">
            <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z"/>
            <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z"/>
            <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5"/>
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-emerald-800 mb-2 text-lg">Ready to track your decisions</h4>
          <p class="text-emerald-600 max-w-md mx-auto">
            Your comparison history will appear here as you make choices. Each decision helps build a more accurate ranking.
          </p>
        </div>
      </div>
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
  canUndoComparison?: (gameId: string) => boolean  // Function to check if specific comparison can be undone
  items?: readonly { id: string; label: string }[]  // List items for gameId resolution
}

/**
 * Events emitted by the ComparisonLog component
 */
interface Emits {
  undo: []  // When user wants to undo the latest comparison
  undoComparison: [gameId: string]  // When user wants to undo a specific comparison
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


/**
 * Gets relative time for a log entry based on its position
 */
const getTimeAgo = (index: number): string => {
  if (index === 0) return 'just now'
  if (index === 1) return '1 comparison ago'
  return `${index} comparisons ago`
}

/**
 * Extracts gameId from a log entry
 */
const getGameIdFromEntry = (entry: string): string => {
  if (!props.items) return ''
  
  let itemAId = '', itemBId = ''
  
  // Handle "Pizza beat Burger" format
  const beatMatch = entry.match(/(.+) beat (.+)/)
  if (beatMatch) {
    const [, winner, loser] = beatMatch
    const winnerId = props.items.find(item => item.label === winner)?.id
    const loserId = props.items.find(item => item.label === loser)?.id
    if (winnerId && loserId) {
      itemAId = winnerId
      itemBId = loserId
    }
  }
  
  // Handle "Pizza vs Burger (skipped)" format
  const skipMatch = entry.match(/(.+) vs (.+) \(skipped\)/)
  if (skipMatch) {
    const [, itemA, itemB] = skipMatch
    itemAId = props.items.find(item => item.label === itemA)?.id || ''
    itemBId = props.items.find(item => item.label === itemB)?.id || ''
  }
  
  if (!itemAId || !itemBId) return ''
  
  // Try both possible game ID orders since we don't know which order was used originally
  const gameId1 = `game-${itemAId}-${itemBId}`
  const gameId2 = `game-${itemBId}-${itemAId}`
  
  // Check which one can actually be undone (exists in action history)
  if (props.canUndoComparison?.(gameId1)) {
    return gameId1
  } else if (props.canUndoComparison?.(gameId2)) {
    return gameId2
  }
  
  // Default to first format if we can't determine which is correct
  return gameId1
}

/**
 * Checks if a log entry can be undone
 */
const canUndoEntry = (entry: string): boolean => {
  if (!props.canUndoComparison) return false
  const gameId = getGameIdFromEntry(entry)
  return gameId ? props.canUndoComparison(gameId) : false
}

/**
 * Handles undo click
 */
const handleUndoClick = (entry: string) => {
  const gameId = getGameIdFromEntry(entry)
  if (gameId) {
    emit('undoComparison', gameId)
  }
}
</script>