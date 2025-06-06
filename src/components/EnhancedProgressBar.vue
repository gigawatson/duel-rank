<!--
  EnhancedProgressBar Component
  
  Beautiful, animated progress visualization with multiple indicators:
  - Overall completion progress
  - Item-by-item confidence levels
  - Comparison efficiency metrics
  - Visual feedback on ranking quality
-->
<template>
  <div class="space-y-4">
    <!-- Main Progress Section -->
    <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
      <div class="flex justify-between items-center mb-3">
        <h3 class="font-semibold text-gray-800">Ranking Progress</h3>
        <div class="text-sm text-gray-600">
          {{ completed }} / {{ total }} comparisons
        </div>
      </div>
      
      <!-- Animated Progress Bar -->
      <div class="relative">
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            class="h-3 rounded-full transition-all duration-700 ease-out relative overflow-hidden"
            :class="progressBarClass"
            :style="{ width: percent + '%' }"
          >
            <!-- Animated shimmer effect -->
            <div 
              v-if="percent > 0 && percent < 100"
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"
            ></div>
          </div>
        </div>
        
        <!-- Progress Labels -->
        <div class="flex justify-between text-xs text-gray-500 mt-1">
          <span>{{ percent }}% complete</span>
          <span v-if="remainingPairs > 0 && refining">{{ remainingPairs }} pairs left</span>
          <span v-else-if="percent === 100">🎉 Perfect!</span>
          <span v-else>{{ Math.ceil((total - completed) * estimatedTimePerComparison) }}s remaining</span>
        </div>
      </div>
    </div>

    <!-- Detailed Statistics Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      <!-- Efficiency Score -->
      <div class="bg-white border border-green-200 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-600">{{ efficiencyScore }}%</div>
        <div class="text-xs text-gray-500">Efficiency</div>
        <div class="text-xs text-gray-400">{{ completed }} comparisons for {{ itemCount }} items</div>
      </div>
      
      <!-- Average Confidence -->
      <div class="bg-white border border-blue-200 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-blue-600">{{ Math.round(averageConfidence * 100) }}%</div>
        <div class="text-xs text-gray-500">Avg Confidence</div>
        <div class="text-xs text-gray-400">How certain we are</div>
      </div>
      
      <!-- Ranking Quality -->
      <div class="bg-white border border-purple-200 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-purple-600">{{ rankingQuality }}/5</div>
        <div class="text-xs text-gray-500">Quality</div>
        <div class="text-xs text-gray-400">⭐ Ranking strength</div>
      </div>
      
      <!-- Comparisons Per Item -->
      <div class="bg-white border border-orange-200 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-orange-600">{{ comparisonsPerItem }}</div>
        <div class="text-xs text-gray-500">Per Item</div>
        <div class="text-xs text-gray-400">Avg comparisons</div>
      </div>
    </div>

    <!-- Item Confidence Visualization -->
    <div v-if="itemCount > 0" class="bg-white border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
        <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
        Item Confidence Levels
      </h4>
      
      <div class="space-y-2">
        <div 
          v-for="(item, index) in sortedItemsWithConfidence" 
          :key="item.id"
          class="flex items-center space-x-3"
        >
          <!-- Rank Position -->
          <div class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
            {{ index + 1 }}
          </div>
          
          <!-- Item Name -->
          <div class="flex-1 min-w-0">
            <div class="font-medium text-gray-800 truncate">{{ item.label }}</div>
          </div>
          
          <!-- Confidence Bar -->
          <div class="flex-1 max-w-32">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div
                class="h-2 rounded-full transition-all duration-500"
                :class="getConfidenceColor(item.confidence)"
                :style="{ width: (item.confidence * 100) + '%' }"
              ></div>
            </div>
          </div>
          
          <!-- Confidence Percentage -->
          <div class="text-sm text-gray-500 w-12 text-right">
            {{ Math.round(item.confidence * 100) }}%
          </div>
          
          <!-- Status Icon -->
          <div class="w-5">
            <span v-if="item.confidence >= 0.8" class="text-green-500" title="High confidence">✓</span>
            <span v-else-if="item.confidence >= 0.5" class="text-yellow-500" title="Medium confidence">~</span>
            <span v-else class="text-red-500" title="Low confidence">?</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Visual Progress Indicator -->
    <div class="bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 rounded-lg p-4">
      <h4 class="font-semibold text-gray-800 mb-3">Progress Visualization</h4>
      
      <!-- Circular Progress Rings -->
      <div class="flex justify-center space-x-8">
        <!-- Overall Progress Ring -->
        <div class="relative w-24 h-24">
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              class="text-gray-300"
              stroke="currentColor"
              stroke-width="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="text-blue-500 transition-all duration-700 ease-out"
              stroke="currentColor"
              stroke-width="3"
              fill="transparent"
              :stroke-dasharray="`${percent}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-semibold text-gray-700">{{ percent }}%</span>
          </div>
        </div>
        
        <!-- Confidence Ring -->
        <div class="relative w-24 h-24">
          <svg class="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              class="text-gray-300"
              stroke="currentColor"
              stroke-width="3"
              fill="transparent"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="text-green-500 transition-all duration-700 ease-out"
              stroke="currentColor"
              stroke-width="3"
              fill="transparent"
              :stroke-dasharray="`${averageConfidence * 100}, 100`"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-sm font-semibold text-gray-700">{{ Math.round(averageConfidence * 100) }}%</span>
          </div>
        </div>
      </div>
      
      <div class="flex justify-center mt-2 text-xs text-gray-500">
        <div class="w-24 text-center">Completion</div>
        <div class="w-8"></div>
        <div class="w-24 text-center">Confidence</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

/**
 * Props for the EnhancedProgressBar component
 */
interface Props {
  completed: number           // Number of completed comparisons
  total: number              // Total number of possible comparisons
  percent: number            // Completion percentage
  remainingPairs: number     // Number of pairs still needing comparison
  refining: boolean          // Whether in refining mode
  ranking: Array<{           // Current ranking with confidence
    id: string
    rank: number
    confidence: number
  }>
  getLabel: (id: string) => string  // Function to get item labels
  itemCount: number          // Total number of items
}

const props = defineProps<Props>()

/**
 * Estimated time per comparison in seconds (for time remaining calculation)
 */
const estimatedTimePerComparison = 3

/**
 * Progress bar color class based on completion percentage
 */
const progressBarClass = computed(() => {
  if (props.percent === 100) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (props.percent >= 75) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  if (props.percent >= 50) return 'bg-gradient-to-r from-purple-400 to-purple-500'
  if (props.percent >= 25) return 'bg-gradient-to-r from-orange-400 to-orange-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
})

/**
 * Efficiency score based on comparisons made vs theoretical minimum
 */
const efficiencyScore = computed(() => {
  if (props.total === 0 || props.itemCount <= 1) return 100
  
  // Theoretical minimum comparisons needed (roughly n-1 for n items)
  const theoreticalMinimum = Math.max(1, props.itemCount - 1)
  return Math.min(100, Math.round((theoreticalMinimum / Math.max(1, props.completed)) * 100))
})

/**
 * Average confidence across all ranked items
 */
const averageConfidence = computed(() => {
  if (props.ranking.length === 0) return 0
  
  const totalConfidence = props.ranking.reduce((sum, item) => sum + item.confidence, 0)
  return totalConfidence / props.ranking.length
})

/**
 * Ranking quality score from 1-5 stars
 */
const rankingQuality = computed(() => {
  const avgConf = averageConfidence.value
  if (avgConf >= 0.9) return 5
  if (avgConf >= 0.7) return 4
  if (avgConf >= 0.5) return 3
  if (avgConf >= 0.3) return 2
  return 1
})

/**
 * Average number of comparisons per item
 */
const comparisonsPerItem = computed(() => {
  if (props.itemCount === 0) return 0
  return Math.round((props.completed * 2) / props.itemCount * 10) / 10
})

/**
 * Items sorted by rank with confidence and labels
 */
const sortedItemsWithConfidence = computed(() => {
  return props.ranking.map(item => ({
    ...item,
    label: props.getLabel(item.id)
  })).sort((a, b) => a.rank - b.rank)
})

/**
 * Get confidence bar color class based on confidence level
 */
const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (confidence >= 0.6) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  if (confidence >= 0.4) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  if (confidence >= 0.2) return 'bg-gradient-to-r from-orange-400 to-orange-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
}
</script>

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 2s infinite;
}
</style>