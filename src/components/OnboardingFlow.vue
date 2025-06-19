<!--
  OnboardingFlow Component
  
  Provides a progressive onboarding experience:
  1. No lists: Create first list interface
  2. Has lists: Full interface with list management and items
-->
<template>
  <div>
    <!-- No Lists State: Welcome & Create First List -->
    <div v-if="!hasLists" class="space-y-8">

      <!-- Create First List -->
      <div class="max-w-sm mx-auto">
        <div class="bg-gradient-to-r from-violet-50 to-violet-100 border border-violet-800/10 rounded-xl p-6 space-y-5 mt-18">
          <h2 class="font-semibold text-gray-800 uppercase text-center">Create your first list</h2>

          <form @submit.prevent="handleCreateFirstList" class="space-y-3">
            <input
              ref="firstListInput"
              v-model="firstListName.value.value"
              @input="clearListError"
              placeholder="e.g., Best Movies, Favorite Foods..."
              class="w-full bg-white border border-violet-300 p-3 rounded-lg text-center focus:border-violet-400 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500"
              :class="{ 'border-violet-300 focus:border-violet-400': firstListName.error }"
            />

            <button
              type="submit"
              class="w-full bg-gradient-to-r from-slate-800 via-violet-500 to-zinc-800 hover:from-slate-800 hover:via-violet-500 hover:to-zinc-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
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
      <div class="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-22">
        <div class="text-center space-y-1">
          <div class="w-12 h-12 mx-auto bg-violet-100 ring-1 ring-violet-200 inset-ring inset-ring-white rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-800">Smart Algorithm</h4>
          <p class="text-sm text-gray-600">Minimizes comparisons needed.</p>
        </div>

        <div class="text-center space-y-1">
          <div class="w-12 h-12 mx-auto bg-violet-100 ring-1 ring-violet-200 inset-ring inset-ring-white rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-800">Visual Results</h4>
          <p class="text-sm text-gray-600">Beautiful ranking visualizations.</p>
        </div>

        <div class="text-center space-y-1">
          <div class="w-12 h-12 mx-auto bg-violet-100 ring-1 ring-violet-200 inset-ring inset-ring-white rounded-lg flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </div>
          <h4 class="font-medium text-gray-800">Easy to Use</h4>
          <p class="text-sm text-gray-600">Simple pairwise comparisons.</p>
        </div>
      </div>
    </div>

    <!-- Has Lists State: Full Interface -->
    <div v-else class="space-y-6">
      <ListManager @list-switched="handleListSwitched" @list-created="handleListCreated" />
      <ItemManager ref="itemManager" />
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
const itemManager = ref()

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
 * Handle list switched event from ListManager
 */
const handleListSwitched = () => {
  // Focus the item input in ItemManager when a list is switched
  itemManager.value?.focusItemInput()
}

/**
 * Handle list created event from ListManager
 */
const handleListCreated = () => {
  // Focus the item input in ItemManager when a new list is created
  itemManager.value?.focusItemInput()
}

/**
 * Autofocus the first list input when the component mounts
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
  animation: gradient-shift 5s ease infinite;
}

/* Subtle hover animations */
.transform {
  transform-origin: center;
}
</style>