<!--
  ComparisonProgress Component
  
  Shows progress of the comparison process with:
  - Completion percentage and counts
  - Visual progress bar
  - Remaining pairs indicator
  - Refining mode status
-->
<template>
  <div class="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
    <!-- Enhanced Progress Display -->
    <div class="flex justify-between items-center mb-3">
      <div class="flex items-center space-x-3">
        <h3 class="font-semibold text-gray-800">Progress</h3>
        <span v-if="refining" class="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
          Refining mode
        </span>
      </div>
      <div class="text-sm text-gray-600">
        {{ stats.completed }} / {{ stats.total }} comparisons ({{ stats.percent }}%)
        <span v-if="stats.skipped > 0" class="text-amber-600 ml-2">
          • {{ stats.skipped }} skipped
        </span>
      </div>
    </div>

    <!-- Enhanced Progress Bar with Integrated Status -->
    <div class="relative">
      <!-- Progress Bar Background -->
      <div class="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
        <div
          class="h-6 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-purple-600 relative"
          :style="{ width: stats.percent + '%' }"
        >
          <!-- Progress Bar Label (when there's enough space and not complete) -->
          <div 
            v-if="stats.percent > 15 && stats.percent < 100" 
            class="absolute inset-0 flex items-center justify-center text-white text-xs font-medium"
          >
            {{ stats.percent }}%
          </div>
        </div>
      </div>
      
      <!-- Status Text Overlay -->
      <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          v-if="remainingPairs > 0 && stats.percent < 85" 
          class="text-xs font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-full"
        >
          {{ remainingPairs }} pairs remaining
        </span>
        <span 
          v-else-if="stats.percent === 100" 
          class="text-xs font-medium text-white"
        >Complete!</span>
      </div>
    </div>

    <!-- Completion Status -->
    <!-- Initial ranking complete (transitive resolution) but not all directly compared -->
    <div v-if="hasWorkableRanking && !isComparisonComplete && !refining" class="mt-4">
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-200 rounded-xl">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-violet-800">
            <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
          </svg>

          <span class="text-sm font-medium text-violet-900">Initial ranking complete. Some positions are inferred.</span>
        </div>
        <button 
          @click="$emit('startRefining')" 
          class="px-3 py-1.5 text-xs font-medium bg-white border border-indigo-200 hover:bg-indigo-200 hover:border-indigo-300 text-indigo-900 rounded-md transition-colors cursor-pointer"
        >
          Continue refining →
        </button>
      </div>
    </div>
    

    <div v-else-if="isComparisonComplete && remainingPairs === 0" class="mt-4">
      <div class="flex items-center space-x-2 p-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-indigo-200 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5 text-violet-800">
          <path fill-rule="evenodd" d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm font-medium text-violet-900">100% fully ranked! All items directly compared.</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the ComparisonProgress component
 */
interface Props {
  stats: {
    completed: number
    total: number
    percent: number
    skipped: number
  }
  remainingPairs: number
  refining: boolean
  hasAnyComparisons: boolean
  isComparisonComplete: boolean
  hasWorkableRanking: boolean
}

/**
 * Events emitted by the ComparisonProgress component
 */
interface Emits {
  startRefining: []
  continueRanking: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>