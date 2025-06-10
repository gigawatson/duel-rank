<!--
  ComparisonChoice Component
  
  Displays two items for pairwise comparison with choice buttons.
  Enhanced design to be the focal point of the comparison interface.
-->
<template>
  <div class="text-center space-y-8">
    <!-- Main Question -->
    <div>
      <h2 class="text-3xl font-bold text-gray-800 mb-2">Which is better?</h2>
      <p class="text-lg text-gray-600">Choose your preference to build the ranking</p>
    </div>

    <!-- VS Section with large, prominent buttons -->
    <div class="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
      <!-- Option A -->
      <button
        @click="$emit('choose', game[0])"
        class="flex-1 w-full lg:max-w-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xl p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 cursor-pointer"
      >
        <span class="text-sm font-medium text-blue-100 mb-2 block">Option A</span>
        <span class="text-2xl lg:text-3xl leading-tight">{{ getLabel(game[0]) }}</span>
      </button>

      <!-- VS Divider -->
      <div class="flex items-center justify-center">
        <div class="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-2xl lg:text-3xl px-6 py-3 rounded-full shadow-lg">
          VS
        </div>
      </div>

      <!-- Option B -->
      <button
        @click="$emit('choose', game[1])"
        class="flex-1 w-full lg:max-w-sm bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold text-xl p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300 cursor-pointer"
      >
        <span class="text-sm font-medium text-purple-100 mb-2 block">Option B</span>
        <span class="text-2xl lg:text-3xl leading-tight">{{ getLabel(game[1]) }}</span>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center items-center gap-8">
      <button 
        @click="$emit('skip')" 
        class="flex items-center space-x-2 px-4 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-medium">Skip this pair</span>
      </button>
      
      <button 
        v-if="canUndo"
        @click="$emit('undo')" 
        class="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium cursor-pointer"
        title="Undo last comparison (U)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
        </svg>
        <span>Undo</span>
      </button>
    </div>

    <!-- Keyboard Hints -->
    <div class="text-sm text-gray-400 space-y-1">
      <p>💡 <strong>Keyboard shortcuts:</strong> Press <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">A</kbd> or <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">1</kbd> for Option A, <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">B</kbd> or <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">2</kbd> for Option B</p>
      <p><kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">S</kbd> or <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">Space</kbd> to skip • <kbd class="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-mono">U</kbd> to undo</p>
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