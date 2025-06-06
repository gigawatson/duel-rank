<!--
  Main App Component
  
  Root component that orchestrates the overall application flow.
  Manages view switching between list management and comparison modes.
-->
<template>
  <div class="max-w-xl lg:max-w-4xl xl:max-w-6xl mx-auto p-6 space-y-6 mt-8">
    <!-- App Header -->
    <header class="text-center">
      <h1 class="text-5xl font-bold text-gray-800">Duel Ranker</h1>
      <p class="text-gray-600 mt-2">Compare items pairwise to create rankings</p>
    </header>

    <!-- Mode Toggle (only show if we have lists) -->
    <div v-if="hasLists" class="border-t pt-6">
      <div class="text-center">
        <button 
          @click="toggleMode" 
          class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          :class="canCompare ? (comparing ? 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white shadow-lg hover:shadow-xl focus:ring-gray-300' : 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl focus:ring-blue-300') : 'bg-gray-100 text-gray-400 cursor-not-allowed'"
          :disabled="!canCompare"
        >
          <span v-if="comparing" class="flex items-center space-x-3">
            <svg class="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to List Management</span>
          </span>
          <span v-else class="flex items-center space-x-3">
            <span>Start Comparing Items</span>
            <svg class="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </span>
        </button>
        
        <p v-if="!canCompare" class="text-sm text-gray-500 mt-4 flex items-center justify-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Add at least 2 items to start comparing</span>
        </p>
      </div>
    </div>

    <!-- Main Content Area -->
    <main>
      <!-- Onboarding / List Management (List Mode) -->
      <OnboardingFlow v-if="!comparing" />

      <!-- Comparison Interface (Comparison Mode) -->
      <ComparisonView v-else />
    </main>

    <!-- App Footer -->
    <footer class="text-center text-xs text-gray-500 border-t pt-4">
      <p>
        Create rankings by comparing pairs of items. 
        <br>
        The algorithm uses your choices to infer the complete ranking.
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useListStore } from './stores/useListStore'
import { validateListForComparison } from './utils/validation'

// Import components
import OnboardingFlow from './components/OnboardingFlow.vue'
import ComparisonView from './components/ComparisonView.vue'

// Store and local state
const store = useListStore()
const comparing = ref(false)

// Computed properties
const hasLists = computed(() => store.allLists.length > 0)
const canCompare = computed(() => 
  hasLists.value && validateListForComparison(store.list.items)
)

/**
 * Handles toggling between list management and comparison modes
 */
const toggleMode = () => {
  if (canCompare.value) {
    comparing.value = !comparing.value
  }
}
</script>

<style>
/* Global styles and transitions */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9fafb;
  margin: 0;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input:focus,
select:focus,
button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions for all interactive elements */
button,
input,
select {
  transition: all 0.2s ease;
}
</style>