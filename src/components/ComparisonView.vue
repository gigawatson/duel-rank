<!--
  ComparisonView Component
  
  Handles the comparison/ranking interface including progress tracking,
  pairwise comparisons, and results display.
  
  Responsive layout:
  - Mobile: Stacked vertically for easy scrolling
  - Desktop: Side-by-side visualizations for better overview
-->
<template>
  <div class="space-y-8">
    <!-- Comparison Header -->
    <ComparisonHeader />

    <!-- Progress Bar - Compact supporting information -->
    <div class="bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
        <!-- Simplified Progress Display -->
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-gray-800">Progress</h3>
          <div class="text-sm text-gray-600">
            {{ stats.completed }} / {{ stats.total }} comparisons ({{ stats.percent }}%)
          </div>
        </div>

        <!-- Simple Progress Bar -->
        <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
              class="h-3 rounded-full transition-all duration-700 ease-out bg-gradient-to-r from-blue-500 to-purple-600"
              :style="{ width: stats.percent + '%' }"
          >
          </div>
        </div>

        <!-- Progress Status -->
        <div class="flex justify-between text-xs text-gray-500 mt-2">
          <span v-if="remainingPairs > 0">{{ remainingPairs }} pairs remaining</span>
          <span v-else-if="stats.percent === 100">🎉 All comparisons complete!</span>
          <span v-else>Ready for more comparisons</span>

          <span v-if="refining" class="text-purple-600 font-medium">Refining mode</span>
        </div>
    </div>

    <!-- MAIN COMPARISON SECTION - Front and Center, right after header -->
    <div v-if="currentGame" class="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-800/15 inset-ring inset-ring-white rounded-lg px-10 py-14">
      <div class="max-w-4xl mx-auto">
        <ComparisonChoice 
          :game="currentGame"
          :get-label="labelFor"
          :can-undo="canUndo"
          @choose="choose"
          @skip="skip"
          @undo="undoLastComparison"
        />
      </div>
    </div>

    <!-- Completion Status - Also prominent when active -->
    <div v-else-if="itemCount >= 2" class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <CompletionStatus
            :remaining-pairs="remainingPairs"
            :refining="refining"
            :has-any-comparisons="hasAnyComparisons"
            :is-comparison-complete="isComparisonComplete"
            @start-refining="startRefining"
        />
      </div>
    </div>

    <!-- Results & Analysis Section - Styled to match other sections -->
    <div class="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 border-2 border-gray-200 rounded-2xl p-8 shadow-sm">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h3 class="text-2xl font-bold text-gray-800 mb-2">Results & Analysis</h3>
          <p class="text-gray-600">Track your progress and explore the emerging rankings</p>
        </div>
        <!-- Comparison Log - Full Width, Prominent Position -->
        <div class="mb-8">
          <ComparisonLog 
            :log="log" 
            :can-undo="canUndo"
            :can-undo-comparison="canUndoComparison"
            :items="list.items"
            @undo="undoLastComparison"
            @undo-comparison="undoComparison"
          />
        </div>

        <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <!-- Left Column: Rankings -->
          <div class="space-y-6">
            <!-- Enhanced Rankings Display -->
            <EnhancedRankingsList 
              :ranking="ranking"
              :list="list"
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useComparison } from '../composables/useComparison'
import ComparisonHeader from './ComparisonHeader.vue'
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
  startRefining,
  canUndo,
  choose,
  skip,
  undoLastComparison,
  undoComparison,
  canUndoComparison,
  labelFor,
  isDirectlyConfirmed,
  toggleComparing
} = useComparison()

// Keyboard shortcuts
const handleKeyDown = (event: KeyboardEvent) => {
  // Only handle shortcuts when we have a current game
  if (!currentGame.value) return
  
  // Prevent shortcuts when typing in inputs
  const target = event.target as HTMLElement
  if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
  
  switch (event.key.toLowerCase()) {
    case 'a':
    case '1':
      // Choose Option A (left option)
      event.preventDefault()
      choose(currentGame.value[0])
      break
    case 'b':
    case '2':
      // Choose Option B (right option)
      event.preventDefault()
      choose(currentGame.value[1])
      break
    case 's':
    case ' ':
      // Skip comparison
      event.preventDefault()
      skip()
      break
    case 'u':
      if (canUndo.value) {
        event.preventDefault()
        undoLastComparison()
      }
      break
  }
}

// Auto-start comparison when this component is mounted
const autoStart = () => {
  if (!comparing.value) {
    toggleComparing()
  }
}

// Local computed properties
const itemCount = computed(() => list.value.items.length)

// Set up keyboard listeners and auto-start
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  autoStart()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>