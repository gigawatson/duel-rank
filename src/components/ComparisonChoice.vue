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
    <div class="text-center mt-2">
      <button 
        @click="$emit('skip')" 
        class="text-sm text-gray-500 underline hover:text-gray-700 transition-colors"
      >
        Skip this pair
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
}

/**
 * Events emitted by the ComparisonChoice component
 */
interface Emits {
  choose: [winner: string]  // When user chooses a winner
  skip: []  // When user skips the comparison
}

defineProps<Props>()
defineEmits<Emits>()
</script>