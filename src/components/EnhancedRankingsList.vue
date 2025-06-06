<!--
  EnhancedRankingsList Component
  
  Beautiful, animated ranking display with:
  - Smooth position transitions
  - Confidence indicators
  - Interactive elements
  - Visual ranking strength indicators
  - Hover effects and detailed tooltips
-->
<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center">
        <span class="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
        Live Ranking
      </h2>
      
      <div class="flex items-center space-x-4">
        <!-- Legend -->
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Confirmed</span>
          </div>
          <div class="flex items-center space-x-1">
            <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Inferred</span>
          </div>
        </div>
        
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
        class="space-y-2"
        appear
      >
        <div
          v-for="(entry, index) in ranking"
          :key="entry.id"
          class="group relative bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02]"
          :class="getRankingItemClass(entry, index)"
        >
          <!-- Rank Badge -->
          <div class="absolute -left-3 -top-3 z-10">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
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
                  class="px-2 py-1 rounded-full text-xs font-medium"
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
                <div class="text-xs text-gray-500 w-10 text-right">
                  {{ Math.round(entry.confidence * 100) }}%
                </div>
              </div>
            </div>

            <!-- Status Indicators -->
            <div class="flex items-center space-x-3 ml-4">
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

          <!-- Hover Details -->
          <div class="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
          
          <!-- Tooltip on Hover -->
          <div class="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded-md px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-20">
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
      <div class="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-3">
        <div class="text-lg font-bold text-green-700">{{ confirmedItems }}</div>
        <div class="text-sm text-green-600">Directly Confirmed</div>
      </div>
      
      <div class="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-3">
        <div class="text-lg font-bold text-yellow-700">{{ inferredItems }}</div>
        <div class="text-sm text-yellow-600">Inferred Positions</div>
      </div>
      
      <div class="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-3">
        <div class="text-lg font-bold text-blue-700">{{ Math.round(averageConfidence * 100) }}%</div>
        <div class="text-sm text-blue-600">Average Confidence</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { RankingEntry, List } from '../types'
import ExportMenu from './ExportMenu.vue'

/**
 * Props for the EnhancedRankingsList component
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
 * Get CSS class for ranking item based on position and confidence
 */
const getRankingItemClass = (entry: RankingEntry, index: number): string => {
  const classes = []
  
  // Top 3 special styling
  if (index === 0) classes.push('ring-2 ring-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50')
  else if (index === 1) classes.push('ring-2 ring-gray-300 bg-gradient-to-r from-gray-50 to-slate-50')
  else if (index === 2) classes.push('ring-2 ring-orange-300 bg-gradient-to-r from-orange-50 to-amber-50')
  
  // Confidence-based styling
  if (entry.confidence >= 0.8) classes.push('border-green-200')
  else if (entry.confidence >= 0.5) classes.push('border-yellow-200')
  else classes.push('border-red-200')
  
  return classes.join(' ')
}

/**
 * Get CSS class for rank badge based on position
 */
const getRankBadgeClass = (index: number): string => {
  if (index === 0) return 'bg-gradient-to-r from-yellow-400 to-yellow-500'
  if (index === 1) return 'bg-gradient-to-r from-gray-400 to-gray-500'
  if (index === 2) return 'bg-gradient-to-r from-orange-400 to-orange-500'
  return 'bg-gradient-to-r from-blue-400 to-blue-500'
}

/**
 * Get CSS class for confidence badge
 */
const getConfidenceBadgeClass = (confidence: number): string => {
  if (confidence >= 0.8) return 'bg-green-100 text-green-700'
  if (confidence >= 0.6) return 'bg-blue-100 text-blue-700'
  if (confidence >= 0.4) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-700'
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
    ? 'bg-green-100 text-green-600' 
    : 'bg-yellow-100 text-yellow-600'
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
/* Enhanced ranking transition animations */
.ranking-enter-active,
.ranking-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.ranking-enter-from {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.ranking-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.ranking-move {
  transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Hover glow effect */
.group:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Smooth confidence bar animation */
.confidence-bar {
  transition: width 0.7s cubic-bezier(0.25, 0.8, 0.25, 1);
}
</style>