<!--
  ComparisonProgress Component
  
  Shows progress of the comparison process with:
  - Completion percentage and counts
  - Visual progress bar
  - Remaining pairs indicator
  - Refining mode status
-->
<template>
  <div class="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-6">
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
        >
          🎉 Complete!
        </span>
      </div>
    </div>

    <!-- Completion Status -->
    <!-- Initial ranking complete (transitive resolution) but not all directly compared -->
    <div v-if="hasWorkableRanking && !isComparisonComplete && !refining" class="mt-4">
      <div class="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <div class="flex items-center space-x-2">
          <span class="text-green-600">✔</span>
          <span class="text-sm font-medium text-green-700">Initial ranking complete. Some positions are inferred.</span>
        </div>
        <button 
          @click="$emit('startRefining')" 
          class="px-3 py-1.5 text-xs font-medium bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors cursor-pointer"
        >
          Continue refining →
        </button>
      </div>
    </div>
    

    <div v-else-if="isComparisonComplete && remainingPairs === 0" class="mt-4">
      <div class="flex items-center space-x-2 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
        <span class="text-green-600">🎉</span>
        <span class="text-sm font-medium text-green-700">100% fully ranked! All items directly compared.</span>
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