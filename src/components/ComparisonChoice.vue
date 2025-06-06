<!--
  ComparisonChoice Component
  
  Displays two items for pairwise comparison with choice buttons.
-->
<template>
  <div>
    <p class="text-gray-600 mb-4 text-center">Which one is better?</p>
    <div class="flex gap-4">
      <button
        @click="$emit('choose', game[0])"
        class="flex-1 border-2 border-blue-500 text-blue-600 font-semibold p-4 rounded hover:bg-blue-50 transition-colors"
      >
        {{ getLabel(game[0]) }}
      </button>
      <button
        @click="$emit('choose', game[1])"
        class="flex-1 border-2 border-purple-500 text-purple-600 font-semibold p-4 rounded hover:bg-purple-50 transition-colors"
      >
        {{ getLabel(game[1]) }}
      </button>
    </div>
    <div class="flex justify-center items-center gap-6 mt-4">
      <button 
        @click="$emit('skip')" 
        class="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
      >
        Skip this pair
      </button>
      
      <button 
        v-if="canUndo"
        @click="$emit('undo')" 
        class="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
        title="Undo last comparison (U)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
        </svg>
        <span>Undo</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the ComparisonChoice component
 */
interface Props {
  game: readonly [string, string]  // Pair of item IDs to compare
  getLabel: (id: string) => string  // Function to get display label for item ID
  canUndo: boolean  // Whether undo is available
}

/**
 * Events emitted by the ComparisonChoice component
 */
interface Emits {
  choose: [winner: string]  // When user chooses a winner
  skip: []  // When user skips the comparison
  undo: []  // When user undoes the last comparison
}

defineProps<Props>()
defineEmits<Emits>()
</script>