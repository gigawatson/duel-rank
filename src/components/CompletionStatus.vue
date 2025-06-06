<!--
  CompletionStatus Component
  
  Shows completion status and options for refining when comparisons are done.
  Handles different states: no comparisons yet, partial completion, fully complete.
-->
<template>
  <!-- No comparisons made yet -->
  <div v-if="!hasAnyComparisons" class="text-blue-700 font-semibold space-y-2 bg-blue-50 border border-blue-200 rounded p-4">
    <p>🎯 Ready to start ranking!</p>
    <p class="text-sm text-blue-600">
      Compare pairs of items to build your ranking. The algorithm will infer relationships to minimize comparisons needed.
    </p>
  </div>

  <!-- Comparisons in progress or complete -->
  <div v-else-if="isComparisonComplete" class="text-green-700 font-semibold space-y-2 bg-green-50 border border-green-200 rounded p-4">
    <template v-if="remainingPairs > 0">
      <p>✔ Initial ranking complete. Some item positions are inferred.</p>
      <button 
        v-if="!refining" 
        @click="$emit('startRefining')" 
        class="text-sm text-blue-700 underline hover:text-blue-900 transition-colors"
      >
        → Continue refining ranking
      </button>
      <p v-else class="text-blue-700">
        🔍 Refining mode: Compare remaining pairs for precise ranking
      </p>
    </template>
    <template v-else>
      <p>🎉 100% fully ranked!</p>
      <p class="text-sm text-green-600">
        All items have been directly compared for complete accuracy.
      </p>
    </template>
  </div>

  <!-- Error state - shouldn't happen but good fallback -->
  <div v-else class="text-gray-700 font-semibold space-y-2 bg-gray-50 border border-gray-200 rounded p-4">
    <p>⚠️ Unexpected state</p>
    <p class="text-sm text-gray-600">
      There seems to be an issue with the comparison state. Try refreshing or resetting the list.
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the CompletionStatus component
 */
interface Props {
  remainingPairs: number  // Number of pairs still needing comparison
  refining: boolean       // Whether in refining mode
  hasAnyComparisons: boolean  // Whether any comparisons have been made
  isComparisonComplete: boolean  // Whether initial comparisons are done
}

/**
 * Events emitted by the CompletionStatus component
 */
interface Emits {
  startRefining: []  // When user wants to start refining
}

defineProps<Props>()
defineEmits<Emits>()
</script>