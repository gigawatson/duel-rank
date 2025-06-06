<!--
  ComparisonView Component
  
  Handles the comparison/ranking interface including progress tracking,
  pairwise comparisons, and results display.
  
  Responsive layout:
  - Mobile: Stacked vertically for easy scrolling
  - Desktop: Side-by-side visualizations for better overview
-->
<template>
  <div class="space-y-6">
    <!-- Comparison Header -->
    <ComparisonHeader />

    <!-- Top Section: Progress and Current Action -->
    <div class="space-y-4">
      <!-- Enhanced Progress Visualization -->
      <EnhancedProgressBar 
        :completed="stats.completed"
        :total="stats.total" 
        :percent="stats.percent"
        :remaining-pairs="remainingPairs"
        :refining="refining"
        :ranking="ranking"
        :get-label="labelFor"
        :item-count="itemCount"
      />

      <!-- Current Comparison -->
      <ComparisonChoice 
        v-if="currentGame"
        :game="currentGame"
        :get-label="labelFor"
        @choose="choose"
        @skip="skip"
      />

      <!-- Completion Status -->
      <CompletionStatus
        v-else-if="itemCount >= 2"
        :remaining-pairs="remainingPairs"
        :refining="refining"
        :has-any-comparisons="hasAnyComparisons"
        :is-comparison-complete="isComparisonComplete"
        @start-refining="startRefining"
      />
    </div>

    <!-- Main Visualizations Section -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <!-- Left Column: Rankings -->
      <div class="space-y-6">
        <!-- Enhanced Rankings Display -->
        <EnhancedRankingsList 
          :ranking="ranking"
          :get-label="labelFor"
          :is-directly-confirmed="isDirectlyConfirmed"
        />
      </div>

      <!-- Right Column: Analysis & History -->
      <div class="space-y-6">
        <!-- Comparison History Visualization -->
        <ComparisonHistoryVisualization
          :games="list.games"
          :items="list.items"
          :get-label="labelFor"
        />

        <!-- Comparison Log -->
        <ComparisonLog :log="log" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useComparison } from '../composables/useComparison'
import ComparisonHeader from './ComparisonHeader.vue'
import EnhancedProgressBar from './EnhancedProgressBar.vue'
import ComparisonChoice from './ComparisonChoice.vue'
import CompletionStatus from './CompletionStatus.vue'
import EnhancedRankingsList from './EnhancedRankingsList.vue'
import ComparisonHistoryVisualization from './ComparisonHistoryVisualization.vue'
import ComparisonLog from './ComparisonLog.vue'

// Use comparison composable for all comparison logic
const {
  comparing,
  currentGame,
  ranking,
  remainingPairs,
  stats,
  log,
  refining,
  list,
  hasAnyComparisons,
  isComparisonComplete,
  choose,
  skip,
  startRefining,
  labelFor,
  isDirectlyConfirmed,
  toggleComparing
} = useComparison()

// Auto-start comparison when this component is mounted
import { onMounted } from 'vue'
onMounted(() => {
  if (!comparing.value) {
    toggleComparing()
  }
})

// Local computed properties
const itemCount = computed(() => list.value.items.length)
</script>