<!--
  ComparisonRankingsList Component
  
  Beautiful, animated ranking display with:
  - Smooth position transitions
  - Confidence indicators
  - Interactive elements
  - Visual ranking strength indicators
  - Hover effects and detailed tooltips
-->
<template>
  <div class="p-6 border border-gray-300 rounded-xl bg-white">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center">Live Ranking</h2>
      
      <div class="flex items-center space-x-4">
        <!-- Export Menu -->
        <ExportMenu 
          :list="list"
          :get-label-fn="getLabel"
        />
      </div>
    </div>

    <!-- Rankings Container -->
    <div class="space-y-2">
      <TransitionGroup 
        name="ranking" 
        tag="div" 
        class="space-y-4"
        appear
      >
        <div
          v-for="(entry, index) in ranking"
          :key="entry.id"
          class="group relative bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] hover:cursor-help"
        >
          <!-- Rank Badge -->
          <div class="absolute -left-2.5 -top-2.5 z-10">
            <div 
              class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-md inset-ring inset-ring-white/60"
              :class="getRankBadgeClass(index)"
            >
              {{ entry.rank }}
            </div>
          </div>

          <!-- Main Content -->
          <div class="flex items-center justify-between pl-6">
            <!-- Item Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3">
                <h3 class="font-semibold text-gray-800 truncate">
                  {{ getLabel(entry.id) }}
                </h3>
                
                <!-- Confidence Badge -->
                <div 
                  class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                  :class="getConfidenceBadgeClass(entry.confidence)"
                >
                  {{ Math.round(entry.confidence * 100) }}% sure
                </div>
              </div>
              
              <!-- Confidence Bar -->
              <div class="mt-2 flex items-center space-x-2">
                <div class="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-2 rounded-full transition-all duration-700 ease-out"
                    :class="getConfidenceBarClass(entry.confidence)"
                    :style="{ width: (entry.confidence * 100) + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Status Indicators -->
            <div class="flex items-end justify-center space-x-3 ml-4">
              <!-- Direct Confirmation Status -->
              <div class="flex flex-col items-center">
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center"
                  :class="getStatusIconClass(entry.id)"
                >
                  <span class="text-sm">
                    {{ getStatusIcon(entry.id) }}
                  </span>
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ getStatusLabel(entry.id) }}
                </div>
              </div>

              <!-- Ranking Strength Indicator -->
              <div class="flex flex-col items-center">
                <div class="flex space-x-1">
                  <div 
                    v-for="i in 5" 
                    :key="i"
                    class="w-1 h-4 rounded-full"
                    :class="i <= getRankingStrength(entry.confidence) ? 'bg-blue-500' : 'bg-gray-200'"
                  ></div>
                </div>
                <div class="text-xs text-gray-500 mt-1">Strength</div>
              </div>
            </div>
          </div>
          
          <!-- Tooltip on Hover -->
          <div class="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-gray-800 text-white text-sm rounded-md px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20 shadow-xl">
            Rank {{ entry.rank }} • {{ Math.round(entry.confidence * 100) }}% confidence • {{ getDetailedStatus(entry.id) }}
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Empty State -->
    <div v-if="ranking.length === 0" class="text-center py-12 text-gray-500">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <span class="text-2xl">📊</span>
      </div>
      <p class="text-lg font-medium">No items to rank yet</p>
      <p class="text-sm">Add some items to start building your ranking</p>
    </div>

    <!-- Ranking Statistics -->
    <div v-if="ranking.length > 0" class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3">
        <div class="text-lg font-bold">{{ confirmedItems }}</div>
        <div class="text-sm">Directly Confirmed</div>
      </div>

      <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3">
        <div class="text-lg font-bold">{{ inferredItems }}</div>
        <div class="text-sm">Inferred Positions</div>
      </div>

      <div class="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-3">
        <div class="text-lg font-bold">{{ Math.round(averageConfidence * 100) }}%</div>
        <div class="text-sm">Average Confidence</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingEntry, List } from '../types'
import ExportMenu from './ExportMenu.vue'

/**
 * Props for the ComparisonRankingsList component
 */
interface Props {
  ranking: RankingEntry[]  // Array of ranking entries
  list: List  // The complete list data for export
  getLabel: (id: string) => string  // Function to get display label for item ID
  isDirectlyConfirmed: (id: string) => boolean  // Function to check if item is directly confirmed
}

const props = defineProps<Props>()

/**
 * Number of directly confirmed items
 */
const confirmedItems = computed(() => {
  return props.ranking.filter(entry => props.isDirectlyConfirmed(entry.id)).length
})

/**
 * Number of items with inferred positions
 */
const inferredItems = computed(() => {
  return props.ranking.length - confirmedItems.value
})

/**
 * Average confidence across all items
 */
const averageConfidence = computed(() => {
  if (props.ranking.length === 0) return 0
  const total = props.ranking.reduce((sum, entry) => sum + entry.confidence, 0)
  return total / props.ranking.length
})

/**
 * Get CSS class for rank badge based on position
 */
const getRankBadgeClass = (index: number): string => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500 border border-yellow-500'
  if (index === 1) return 'bg-gradient-to-r from-gray-400 to-gray-500 border border-gray-400'
  if (index === 2) return 'bg-gradient-to-r from-yellow-600 to-amber-700 border border-amber-600'
  return 'bg-gradient-to-r from-indigo-400 to-indigo-500 border border-indigo-400'
}

/**
 * Get CSS class for confidence badge
 */
const getConfidenceBadgeClass = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-200 text-green-900'
  if (confidence >= 0.6) return 'bg-blue-200 text-blue-900'
  if (confidence >= 0.4) return 'bg-yellow-200 text-yellow-900'
  return 'bg-red-200 text-red-900'
}

/**
 * Get CSS class for confidence bar
 */
const getConfidenceBarClass = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-gradient-to-r from-green-400 to-green-500'
  if (confidence >= 0.6) return 'bg-gradient-to-r from-blue-400 to-blue-500'
  if (confidence >= 0.4) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  return 'bg-gradient-to-r from-red-400 to-red-500'
}

/**
 * Get status icon for item
 */
const getStatusIcon = (id: string): string => {
  return props.isDirectlyConfirmed(id) ? '✓' : '~'
}

/**
 * Get status icon CSS class
 */
const getStatusIconClass = (id: string): string => {
  return props.isDirectlyConfirmed(id) 
    ? 'bg-green-200 text-green-700'
    : 'bg-yellow-200 text-yellow-700'
}

/**
 * Get status label
 */
const getStatusLabel = (id: string): string => {
  return props.isDirectlyConfirmed(id) ? 'Direct' : 'Inferred'
}

/**
 * Get detailed status for tooltip
 */
const getDetailedStatus = (id: string): string => {
  return props.isDirectlyConfirmed(id) 
    ? 'Position confirmed by direct comparisons'
    : 'Position inferred from other comparisons'
}

/**
 * Get ranking strength (1-5) based on confidence
 */
const getRankingStrength = (confidence: number): number => {
  return Math.ceil(confidence * 5)
}
</script>

<style scoped>
/* Hover glow effect */
.group:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}
</style>