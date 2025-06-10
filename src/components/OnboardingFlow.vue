<!--
  OnboardingFlow Component
  
  Provides a progressive onboarding experience:
  1. No lists: Create first list interface
  2. Has lists: Full interface with list management and items
-->
<template>
  <div>
    <!-- No Lists State: Welcome & Create First List -->
    <div v-if="!hasLists" class="text-center space-y-8">
      <!-- Welcome Message -->
      <div class="max-w-md mx-auto space-y-4">
        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <span class="text-3xl text-white">🏆</span>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-800">Welcome to Duel Ranker!</h2>
        <p class="text-gray-600 leading-relaxed">
          Create rankings by comparing pairs of items. Our smart algorithm minimizes the number of comparisons needed to build accurate rankings.
        </p>
      </div>

      <!-- Create First List -->
      <div class="max-w-sm mx-auto">
        <div class="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6 space-y-4">
          <h3 class="font-semibold text-gray-800 text-center">Create Your First List</h3>
          
          <form @submit.prevent="handleCreateFirstList" class="space-y-3">
            <input 
              ref="firstListInput"
              v-model="firstListName.value.value" 
              @input="clearListError"
              placeholder="e.g., Best Movies, Favorite Foods..." 
              class="w-full border border-gray-300 p-3 rounded-lg text-center focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': firstListName.error }"
            />
            
            <button 
              type="submit" 
              class="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              :disabled="!firstListName.value.value.trim()"
            >
              Create List & Get Started
            </button>
          </form>

          <!-- Validation Error Display -->
          <p v-if="firstListName.error" class="text-sm text-red-600 text-center">
            {{ firstListName.error }}
          </p>
        </div>
      </div>

      <!-- Features Preview -->
      <div class="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div class="text-center space-y-2">
          <div class="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
            <span class="text-xl">⚡</span>
          </div>
          <h4 class="font-medium text-gray-800">Smart Algorithm</h4>
          <p class="text-sm text-gray-600">Minimizes comparisons needed</p>
        </div>
        
        <div class="text-center space-y-2">
          <div class="w-12 h-12 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
            <span class="text-xl">📊</span>
          </div>
          <h4 class="font-medium text-gray-800">Visual Results</h4>
          <p class="text-sm text-gray-600">Beautiful ranking visualizations</p>
        </div>
        
        <div class="text-center space-y-2">
          <div class="w-12 h-12 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
            <span class="text-xl">🔄</span>
          </div>
          <h4 class="font-medium text-gray-800">Easy to Use</h4>
          <p class="text-sm text-gray-600">Simple pairwise comparisons</p>
        </div>
      </div>
    </div>

    <!-- Has Lists State: Full Interface -->
    <div v-else class="space-y-6">
      <ListManager />
      <ItemManager />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue'
import { useListStore } from '../stores/useListStore'
import { useValidatedInput } from '../composables/useFormValidation'
import { validateListName } from '../utils/validation'
import ListManager from './ListManager.vue'
import ItemManager from './ItemManager.vue'

// Store access
const store = useListStore()

// Template refs
const firstListInput = ref<HTMLInputElement>()

// Form handling with validation
const firstListName = useValidatedInput('', validateListName)

// Computed properties
const hasLists = computed(() => store.allLists.length > 0)

/**
 * Handles creating the first list with validation and nice UX
 */
const handleCreateFirstList = async () => {
  const trimmedValue = firstListName.value.value.trim()
  const isValid = firstListName.validate(trimmedValue, store.allLists)
  
  if (isValid) {
    store.createList(trimmedValue)
    firstListName.reset()
    
    // Focus will automatically shift to the item input in ItemManager
    await nextTick()
  }
}

/**
 * Clears the list name validation error
 */
const clearListError = () => {
  firstListName.clearError?.()
}

/**
 * Auto-focus the first list input when component mounts
 */
onMounted(async () => {
  if (!hasLists.value) {
    await nextTick()
    firstListInput.value?.focus()
  }
})
</script>

<style scoped>
/* Custom gradient animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0 50%; }
  50% { background-position: 100% 50%; }
}

.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Subtle hover animations */
.transform {
  transform-origin: center;
}

/* Focus ring styling */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

input.border-red-500:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>