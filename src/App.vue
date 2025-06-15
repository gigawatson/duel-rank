<!--
  Main App Component
  
  Root component that orchestrates the overall application flow.
  Manages view switching between list management and comparison modes.
-->
<template>
  <div class="max-w-2xl lg:max-w-5xl xl:max-w-7xl mx-auto p-6 space-y-6 mt-12">
    <!-- App Header -->
    <header class="text-center mb-12">
      <h1 class="text-7xl md:text-8xl font-black bg-gradient-to-tl from-slate-800 via-violet-500 to-zinc-400 bg-clip-text text-transparent">Duel Rank</h1>
      <p class="text-gray-600 mt-2 md:text-lg font-medium">Create list rankings by comparing items pairwise.</p>
    </header>

    <!-- Mode Toggle (only show if we have lists) -->
    <div v-if="hasLists" class="border-t border-t-violet-800/10 pt-12 mb-12">
      <div class="text-center">
        <button 
          @click="toggleMode" 
          class="cursor-pointer group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-gradient-to-r from-slate-800 via-violet-500 to-zinc-800 hover:from-slate-800 hover:via-violet-500 hover:to-zinc-800 text-white transition-all duration-200 transform hover:scale-105 focus:outline-none ring-4 ring-violet-300/50 hover:ring-violet-300/80 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          :class="{ 'animated-gradient': !comparing }"
          :disabled="!canCompare"
        >
          <span v-if="comparing" class="flex items-center space-x-3">
            <svg class="w-6 h-6 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span>Back to List Management</span>
          </span>
          <span v-else class="flex items-center space-x-3">
            <span>{{ buttonText }}</span>
            <svg class="w-6 h-6 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </span>
        </button>
        
        <p v-if="!canCompare" class="text-sm text-gray-500 mt-4">
          <span>Add at least two items to start comparing.</span>
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

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useListStore } from './stores/useListStore'
import { validateListForComparison } from './utils/validation'
import { useComparison } from './composables/useComparison'

// Import components
import OnboardingFlow from './components/OnboardingFlow.vue'
import ComparisonView from './components/ComparisonView.vue'

// Store and local state
const store = useListStore()
const comparing = ref(false)

// Comparison state for button text logic
const { hasAnyComparisons, isComparisonComplete } = useComparison()

// Computed properties
const hasLists = computed(() => store.allLists.length > 0)
const canCompare = computed(() => 
  hasLists.value && validateListForComparison(store.list.items)
)

// Determine button text based on comparison state
const buttonText = computed(() => {
  if (!hasAnyComparisons.value) {
    return "Start Comparing Items"
  } else if (isComparisonComplete.value) {
    return "See Completed Ranking"
  } else {
    return "Continue Comparing Items"
  }
})

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
  margin: 0;
}

/* Smooth transitions for all interactive elements */
button,
input,
select {
  transition: all 0.2s ease;
}

/* Animated gradient for comparison button */
@keyframes gradient-shift {
  0%, 100% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
}

.animated-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 5s ease infinite;
}
</style>