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

    <!-- Progress Display -->
    <ComparisonProgress 
      :stats="stats"
      :remaining-pairs="remainingPairs"
      :refining="refining"
      :has-any-comparisons="hasAnyComparisons"
      :is-comparison-complete="isComparisonComplete"
      :has-workable-ranking="hasWorkableRanking"
      @start-refining="startRefining"
      @continue-ranking="continueRanking"
    />

    <!-- MAIN COMPARISON SECTION - Front and Center, right after header -->
    <div v-if="currentGame" class="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-800/15 inset-ring inset-ring-white rounded-lg px-10 py-14">
      <div class="max-w-4xl mx-auto">
        <ComparisonChoice 
          :game="currentGame"
          :get-label="labelFor"
          :can-undo="canUndo"
          @choose="choose"
          @skip="skip"
          @undo="undoLastComparisonWithConfirmation"
        />
      </div>
    </div>

    <!-- Results & Analysis Section - Styled to match other sections -->
    <div class="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <h3 class="text-3xl font-bold text-gray-800 mb-2">Results & Analysis</h3>
          <p class="text-gray-600">Track your progress and explore the emerging rankings</p>
        </div>
        <!-- Comparison Log - Full Width, Prominent Position -->
        <div class="mb-8">
          <ComparisonLog 
            :log="log" 
            :can-undo="canUndo"
            :can-undo-comparison="canUndoComparison"
            :items="list.items"
            @undo="undoLastComparisonWithConfirmation"
            @undo-comparison="undoComparisonWithConfirmation"
          />
        </div>

        <div class="grid grid-cols-1 gap-8">
          <!-- Left Column: Rankings -->
          <div class="space-y-6">
            <!-- Enhanced Rankings Display -->
            <ComparisonRankingsList 
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

  <!-- Confirmation Modal -->
  <ConfirmationModal
    :is-open="confirmationState.isOpen"
    :type="confirmationState.type"
    :title="confirmationState.title"
    :subtitle="confirmationState.subtitle"
    :message="confirmationState.message"
    :confirm-text="confirmationState.confirmText"
    :cancel-text="confirmationState.cancelText"
    @confirm="handleConfirm"
    @dismiss="handleCancel"
  />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, nextTick } from 'vue'
import { useComparison } from '../composables/useComparison'
import { useConfirmation } from '../composables/useConfirmation'
import ComparisonHeader from './ComparisonHeader.vue'
import ComparisonProgress from './ComparisonProgress.vue'
import ComparisonChoice from './ComparisonChoice.vue'
import ComparisonRankingsList from './ComparisonRankingsList.vue'
import ComparisonHistoryVisualization from './ComparisonHistoryVisualization.vue'
import ComparisonLog from './ComparisonLog.vue'
import ConfirmationModal from './ConfirmationModal.vue'

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
  hasWorkableRanking,
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

// Function to continue ranking when there are skipped comparisons
const continueRanking = () => {
  // Enter refining mode to directly compare all remaining pairs
  if (!refining.value) {
    startRefining()
  }
  // Ensure comparison mode is active
  if (!comparing.value) {
    toggleComparing()
  }
}

// Confirmation modal
const { confirmationState, showConfirmation, handleConfirm, handleCancel } = useConfirmation()

// Wrapper functions for undo operations with confirmation
const undoLastComparisonWithConfirmation = async () => {
  const confirmed = await showConfirmation({
    type: 'warning',
    title: 'Undo Comparison',
    subtitle: 'Are you sure?',
    message: 'This will remove your last comparison from the history and update your ranking. This action cannot be undone.',
    confirmText: 'Undo Comparison',
    cancelText: 'Keep Comparison'
  })
  
  if (confirmed) {
    undoLastComparison()
  }
}

const undoComparisonWithConfirmation = async (gameId: string) => {
  const confirmed = await showConfirmation({
    type: 'warning',
    title: 'Undo Comparison',
    subtitle: 'Are you sure?',
    message: 'This will remove this comparison from your history and update your ranking. This action cannot be undone.',
    confirmText: 'Undo Comparison',
    cancelText: 'Keep Comparison'
  })
  
  if (confirmed) {
    undoComparison(gameId)
  }
}

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
        undoLastComparisonWithConfirmation()
      }
      break
  }
}

// Auto-start comparison when this component is mounted
const autoStart = () => {
  if (!comparing.value) {
    // Don't use toggleComparing() if we're already in refining mode
    // because it would clear the refining state
    if (refining.value) {
      comparing.value = true
      // Need to manually trigger updateGame since we bypassed toggleComparing
      // Use nextTick to ensure the comparison state is set first
      nextTick(() => {
        // Access updateGame through the composable's internal structure
        toggleComparing()
        // Now restore refining state that was cleared
        startRefining()
      })
    } else {
      toggleComparing()
    }
  }
}


// Set up keyboard listeners and auto-start
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  autoStart()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>