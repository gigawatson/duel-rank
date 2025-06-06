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
            <!-- Edit Mode -->
            <div v-if="editingListName" class="space-y-2">
              <input 
                ref="editListInput"
                v-model="editListName.value.value"
                @keyup.enter="handleSaveListEdit"
                @keyup.esc="cancelListEdit"
                @blur="handleSaveListEdit"
                class="text-xl font-bold bg-white border border-blue-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': editListName.error }"
              />
              <div class="flex items-center space-x-2">
                <button 
                  @click="handleSaveListEdit"
                  class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Save
                </button>
                <button 
                  @click="cancelListEdit"
                  class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
              <!-- Edit Validation Error -->
              <p v-if="editListName.error && editListName.error.value" class="text-sm text-red-600 flex items-center space-x-1">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ editListName.error?.value }}</span>
              </p>
            </div>
            <!-- View Mode -->
            <div v-else>
              <h2 class="text-xl font-bold text-gray-800">{{ currentList?.name || 'No List Selected' }}</h2>
              <p class="text-sm text-gray-600">
                {{ currentList?.items.length || 0 }} items • 
                {{ currentList?.games.length || 0 }} comparisons •
                <span class="text-gray-500">{{ formatDate(currentList?.createdAt) }}</span>
              </p>
            </div>
          </div>
        </div>

        <!-- List Actions -->
        <div class="flex items-center space-x-2">
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
                @click="handleEditList"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center space-x-2"
                :disabled="lists.length === 0"
              >
                <span class="text-blue-500">✏️</span>
                <span>Edit List Name</span>
              </button>
              <button 
                @click="handleResetList"
                class="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                :disabled="lists.length === 0"
              >
                <span class="text-yellow-500">🔄</span>
                <span>Reset List</span>
              </button>
              <button 
                @click="handleDeleteList"
                class="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center space-x-2"
              >
                <span class="text-red-500">🗑️</span>
                <span>Delete List</span>
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- List Management -->
    <div class="bg-white border border-gray-200 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <span class="text-lg text-white">📚</span>
          </div>
          <div>
            <h3 class="font-semibold text-gray-800">Your Lists</h3>
            <p class="text-sm text-gray-600">Manage your ranking lists</p>
          </div>
        </div>
        <div v-if="lists.length > 0" class="text-sm text-gray-500">
          {{ lists.length }} list{{ lists.length === 1 ? '' : 's' }}
        </div>
      </div>

      <!-- Existing Lists -->
      <div v-if="lists.length > 0" class="space-y-3 mb-6">
        <div
          v-for="list in lists"
          :key="list.id"
          @click="list.id !== selectedListId ? handleSwitchList(list.id) : null"
          class="p-4 border rounded-lg transition-all duration-200"
          :class="[
            list.id === selectedListId 
              ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 cursor-pointer'
          ]"
        >
          <div class="font-medium text-gray-800 flex items-center space-x-2">
            <span>{{ list.name }}</span>
            <span v-if="list.id === selectedListId" class="px-2 py-1 text-xs bg-blue-600 text-white rounded-md">Active</span>
          </div>
          <div class="text-sm text-gray-500 mt-1">
            {{ list.items.length }} items • {{ list.games.length }} comparisons • {{ formatDate(list.createdAt) }}
          </div>
        </div>
      </div>

      <!-- Create New List -->
      <div class="border-t pt-6">
        <h4 class="font-medium text-gray-800 mb-3 flex items-center space-x-2">
          <span class="text-green-600">➕</span>
          <span>Create New List</span>
        </h4>
        
        <form @submit.prevent="handleCreateList" class="space-y-3">
          <input 
            ref="newListInput"
            v-model="newListName.value.value" 
            @input="clearListError"
            placeholder="e.g., Best Restaurants, Top Movies, Favorite Books..." 
            class="w-full p-3 border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
            :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': newListName.error }"
          />
          
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
const editListInput = ref<HTMLInputElement>()

// Local state
const selectedListId = ref(store.activeListId)
const showActions = ref(false)
const editingListName = ref(false)

// Form handling with validation
const newListName = useValidatedInput('', validateListName)
const editListName = useValidatedInput('', validateListName)

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
 * Start editing the current list name
 */
const handleEditList = async () => {
  showActions.value = false
  editingListName.value = true
  editListName.reset()
  editListName.value.value = currentList.value?.name || ''
  
  // Focus the edit input after Vue updates the DOM
  await nextTick()
  editListInput.value?.focus()
  editListInput.value?.select()
}

/**
 * Cancel editing list name
 */
const cancelListEdit = () => {
  editingListName.value = false
  editListName.reset()
}

/**
 * Save the edited list name
 */
const handleSaveListEdit = async () => {
  const trimmedValue = editListName.value.value.trim()
  
  // Don't save if value is empty
  if (!trimmedValue) {
    cancelListEdit()
    return
  }
  
  // Check if name actually changed
  if (currentList.value && currentList.value.name === trimmedValue) {
    // No change, just cancel edit mode
    cancelListEdit()
    return
  }
  
  // Validate the new name
  const otherLists = store.allLists.filter(list => list.id !== selectedListId.value)
  const isValid = editListName.validate(trimmedValue, otherLists)
  
  if (isValid) {
    store.editListName(selectedListId.value, trimmedValue)
    cancelListEdit()
  }
  // If not valid, stay in edit mode to show error
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
    showActions.value = false
  }
  // Don't close edit mode when clicking outside
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