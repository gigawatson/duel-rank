<!--
  ListManager Component
  
  Beautiful, modern list management interface with intuitive controls
  and smooth animations. Handles list creation, selection, and management.
-->
<template>
  <div class="space-y-6">
    <!-- Current List Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div class="flex items-center justify-between">
        <!-- Current List Info -->
        <div class="flex items-center space-x-4">
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <span class="text-xl text-white">📋</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ currentList?.name || 'No List Selected' }}</h2>
            <p class="text-sm text-gray-600">
              {{ currentList?.items.length || 0 }} items • 
              {{ currentList?.games.length || 0 }} comparisons •
              <span class="text-gray-500">{{ formatDate(currentList?.createdAt) }}</span>
            </p>
          </div>
        </div>

        <!-- List Actions -->
        <div class="flex items-center space-x-2">
          <button 
            v-if="lists.length > 1"
            @click.stop="showListSelector = !showListSelector"
            class="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
            title="Switch List"
          >
            <span class="text-sm font-medium text-gray-700">Switch</span>
            <svg class="w-4 h-4 text-gray-500" :class="{ 'rotate-180': showListSelector }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          
          <div class="relative">
            <button 
              @click.stop="showActions = !showActions"
              class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title="List Actions"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"></path>
              </svg>
            </button>
            
            <!-- Actions Dropdown -->
            <div v-if="showActions" @click.stop class="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button 
                @click="handleResetList"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center space-x-2"
                :disabled="lists.length === 0"
              >
                <span class="text-yellow-500">🔄</span>
                <span>Reset List</span>
              </button>
              <button 
                @click="handleDeleteList"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center space-x-2"
                :disabled="lists.length <= 1"
              >
                <span class="text-red-500">🗑️</span>
                <span>Delete List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- List Selector Dropdown -->
      <div v-if="showListSelector && lists.length > 1" class="mt-4 pt-4 border-t border-blue-200">
        <label class="block text-sm font-medium text-gray-700 mb-2">Switch to:</label>
        <div class="grid gap-2">
          <button
            v-for="list in lists"
            :key="list.id"
            @click="handleSwitchList(list.id)"
            class="p-3 text-left border rounded-lg transition-colors hover:bg-white"
            :class="list.id === selectedListId ? 'border-blue-300 bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300'"
          >
            <span class="font-medium text-gray-800 block">{{ list.name }}</span>
            <span class="text-xs text-gray-500 block">
              {{ list.items.length }} items • {{ formatDate(list.createdAt) }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Create New List -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex items-center space-x-3 mb-4">
        <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <span class="text-lg text-white">➕</span>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800">Create New List</h3>
          <p class="text-sm text-gray-600">Add another ranking list to your collection</p>
        </div>
      </div>

      <form @submit.prevent="handleCreateList" class="space-y-3">
        <div class="relative">
          <input 
            ref="newListInput"
            v-model="newListName.value.value" 
            @input="clearListError"
            placeholder="e.g., Best Restaurants, Top Movies, Favorite Books..." 
            class="w-full p-4 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': newListName.error }"
          />
        </div>
        
        <button 
          type="submit" 
          class="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          :disabled="!newListName.value.value.trim()"
        >
          <span>Create List</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
        </button>
      </form>

      <!-- Validation Error Display -->
      <p v-if="newListName.error && newListName.error.value && newListName.error.value.length > 0" class="text-sm text-red-600 mt-2 flex items-center space-x-1">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span>{{ newListName.error?.value }}</span>
      </p>
    </div>

    <!-- List Collection Overview -->
    <div v-if="lists.length > 1" class="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h3 class="font-semibold text-gray-800 mb-4 flex items-center space-x-2">
        <span class="w-2 h-2 bg-gray-400 rounded-full"></span>
        <span>Your Lists ({{ lists.length }})</span>
      </h3>
      
      <div class="grid gap-3">
        <div
          v-for="list in lists"
          :key="list.id"
          class="flex items-center justify-between p-3 bg-white border rounded-lg"
          :class="list.id === selectedListId ? 'border-blue-300 ring-1 ring-blue-200' : 'border-gray-200'"
        >
          <div class="flex-1">
            <div class="font-medium text-gray-800">{{ list.name }}</div>
            <div class="text-xs text-gray-500">
              {{ list.items.length }} items • {{ list.games.length }} comparisons
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button
              v-if="list.id !== selectedListId"
              @click="handleSwitchList(list.id)"
              class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Select
            </button>
            <span v-else class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-md">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useListStore } from '../stores/useListStore'
import { useValidatedInput } from '../composables/useFormValidation'
import { validateListName } from '../utils/validation'

// Store access
const store = useListStore()

// Template refs
const newListInput = ref<HTMLInputElement>()

// Local state
const selectedListId = ref(store.activeListId)
const showListSelector = ref(false)
const showActions = ref(false)

// Form handling with validation
const newListName = useValidatedInput('', validateListName)

// Computed properties
const lists = computed(() => store.allLists)
const currentList = computed(() => store.list)

/**
 * Handles list creation with validation
 */
const handleCreateList = async () => {
  const trimmedValue = newListName.value.value.trim()
  const isValid = newListName.validate(trimmedValue, store.allLists)
  
  if (isValid) {
    store.createList(trimmedValue)
    newListName.reset()
    selectedListId.value = store.activeListId
    
    // Focus back to input for quick multiple additions
    await nextTick()
    newListInput.value?.focus()
  }
}

/**
 * Clears the list name validation error
 */
const clearListError = () => {
  newListName.clearError?.()
}

/**
 * Switches to the selected list
 */
const handleSwitchList = (listId: string) => {
  store.switchList(listId)
  selectedListId.value = listId
  showListSelector.value = false
}

/**
 * Resets the current list (removes all items and games)
 */
const handleResetList = () => {
  showActions.value = false
  if (confirm('Are you sure you want to reset this list? All items and comparisons will be lost.')) {
    store.resetList()
    selectedListId.value = store.activeListId
  }
}

/**
 * Deletes the current list
 */
const handleDeleteList = () => {
  showActions.value = false
  const listName = currentList.value?.name || 'this list'
  if (confirm(`Are you sure you want to delete "${listName}"? This action cannot be undone.`)) {
    store.deleteList(selectedListId.value)
    selectedListId.value = store.activeListId
  }
}

/**
 * Format date for display
 */
const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

// Close dropdowns when clicking outside
const closeDropdowns = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showListSelector.value = false
    showActions.value = false
  }
}

// Watch for store changes and sync local state
watch(() => store.activeListId, (newId) => {
  selectedListId.value = newId
})

// Auto-focus the new list input when component mounts
onMounted(async () => {
  await nextTick()
  newListInput.value?.focus()
  
  // Add click listener to close dropdowns
  document.addEventListener('click', closeDropdowns)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>