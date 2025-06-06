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
    <div v-if="hasLists" class="text-right border-t pt-4">
      <button 
        @click="toggleMode" 
        class="text-sm text-blue-700 underline hover:text-blue-900 transition-colors"
        :disabled="!canCompare"
      >
        {{ comparing ? '← Back to List' : '→ Start Comparing' }}
      </button>
      
      <p v-if="!canCompare" class="text-xs text-gray-500 mt-1">
        Add at least 2 items to start comparing
      </p>
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