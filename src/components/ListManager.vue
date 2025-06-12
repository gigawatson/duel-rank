<!--
  ListManager Component
  
  Beautiful, modern list management interface with intuitive controls
  and smooth animations. Handles list creation, selection, and management.
-->
<template>
  <div class="space-y-6">
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
        <div class="flex items-center space-x-3">
          <div v-if="lists.length > 0" class="text-sm text-gray-500">
            {{ lists.length }} list{{ lists.length === 1 ? '' : 's' }}
          </div>
          <button 
            @click="toggleCreateForm"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-colors cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span>New List</span>
          </button>
        </div>
      </div>

      <!-- Existing Lists -->
      <div v-if="lists.length > 0" class="space-y-3 mb-6">
        <div
          v-for="list in lists"
          :key="list.id"
          class="p-4 border rounded-lg transition-all duration-200"
          :class="[
            list.id === selectedListId 
              ? 'border-blue-300 bg-blue-50 ring-1 ring-blue-200' 
              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
          ]"
        >
          <div class="flex items-center justify-between">
            <div 
              @click="list.id !== selectedListId ? handleSwitchList(list.id) : null"
              class="flex-1"
              :class="[list.id !== selectedListId ? 'cursor-pointer' : '']"
            >
              <!-- Edit Mode for This List -->
              <div v-if="editingListId === list.id" class="space-y-2">
                <input 
                  ref="editListInput"
                  v-model="editListName.value.value"
                  @keyup.enter="handleSaveListEdit(list.id)"
                  @keyup.esc="cancelListEdit"
                  @blur="handleSaveListEdit(list.id)"
                  class="font-medium bg-white border border-blue-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors text-gray-800"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': editListName.error }"
                />
                <div class="flex items-center space-x-2">
                  <button 
                    @click="handleSaveListEdit(list.id)"
                    class="px-2 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                  <button 
                    @click="cancelListEdit"
                    class="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
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
                <div class="font-medium text-gray-800 flex items-center space-x-2">
                  <span>{{ list.name }}</span>
                  <span v-if="list.id === selectedListId" class="px-2 py-1 text-xs bg-blue-600 text-white rounded-md">Active</span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                  {{ list.items.length }} items • {{ list.games.length }} comparisons • {{ formatDate(list.createdAt) }}
                </div>
              </div>
            </div>

            <!-- List Actions -->
            <div class="flex items-center space-x-2 ml-4">
              <div class="relative">
                <button 
                  @click.stop="toggleActions(list.id)"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                  :class="[list.id === selectedListId ? 'hover:bg-blue-100' : '']"
                  title="List Actions"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z"></path>
                  </svg>
                </button>
                
                <!-- Actions Dropdown -->
                <div v-if="showActionsForList === list.id" @click.stop class="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button 
                    @click="handleEditList(list.id)"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <span class="text-blue-500">✏️</span>
                    <span>Edit Name</span>
                  </button>
                  <button 
                    @click="handleResetList(list.id)"
                    class="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                  >
                    <span class="text-yellow-500">🔄</span>
                    <span>Reset List</span>
                  </button>
                  <button 
                    @click="handleDeleteList(list.id)"
                    class="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <span class="text-red-500">🗑️</span>
                    <span>Delete List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New List Form (Compact) -->
      <div v-if="showCreateForm" class="border-t pt-4 mt-4">
        <form @submit.prevent="handleCreateList" class="space-y-3">
          <div class="flex space-x-2">
            <input 
              ref="newListInput"
              v-model="newListName.value.value" 
              @input="clearListError"
              @keyup.esc="hideCreateForm"
              placeholder="Enter list name..." 
              class="flex-1 p-2 text-sm border border-gray-300 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors"
              :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': newListName.error }"
            />
            <button 
              type="submit" 
              class="px-4 py-2 text-sm font-medium bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              :disabled="!newListName.value.value.trim()"
            >
              Create
            </button>
            <button 
              type="button"
              @click="hideCreateForm"
              class="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
          
          <!-- Validation Error Display -->
          <p v-if="newListName.error && newListName.error.value && newListName.error.value.length > 0" class="text-sm text-red-600 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ newListName.error?.value }}</span>
          </p>
        </form>
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
const showActionsForList = ref<string | null>(null)
const editingListId = ref<string | null>(null)
const showCreateForm = ref(false)

// Form handling with validation
const newListName = useValidatedInput('', validateListName)
const editListName = useValidatedInput('', validateListName)

// Computed properties
const lists = computed(() => store.allLists)

/**
 * Show the create form and focus the input
 */
const toggleCreateForm = async () => {
  showCreateForm.value = !showCreateForm.value
  if (showCreateForm.value) {
    newListName.reset()
    await nextTick()
    newListInput.value?.focus()
  }
}

/**
 * Hide the create form and reset
 */
const hideCreateForm = () => {
  showCreateForm.value = false
  newListName.reset()
}

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
    showCreateForm.value = false
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
 * Toggle actions dropdown for a specific list
 */
const toggleActions = (listId: string) => {
  showActionsForList.value = showActionsForList.value === listId ? null : listId
}

/**
 * Resets a specific list (removes all items and games)
 */
const handleResetList = (listId: string) => {
  showActionsForList.value = null
  const list = lists.value.find(l => l.id === listId)
  const listName = list?.name || 'this list'
  
  if (confirm(`Are you sure you want to reset "${listName}"? All items and comparisons will be lost.`)) {
    // Switch to the list first if it's not active
    if (listId !== selectedListId.value) {
      store.switchList(listId)
      selectedListId.value = listId
    }
    store.resetList()
    selectedListId.value = store.activeListId
  }
}

/**
 * Deletes a specific list
 */
const handleDeleteList = (listId: string) => {
  showActionsForList.value = null
  const list = lists.value.find(l => l.id === listId)
  const listName = list?.name || 'this list'
  
  if (confirm(`Are you sure you want to delete "${listName}"? This action cannot be undone.`)) {
    store.deleteList(listId)
    selectedListId.value = store.activeListId
  }
}

/**
 * Start editing a specific list name
 */
const handleEditList = async (listId: string) => {
  showActionsForList.value = null
  editingListId.value = listId
  editListName.reset()
  
  const list = lists.value.find(l => l.id === listId)
  editListName.value.value = list?.name || ''
  
  // Focus the edit input after Vue updates the DOM
  await nextTick()
  editListInput.value?.focus()
  editListInput.value?.select()
}

/**
 * Cancel editing list name
 */
const cancelListEdit = () => {
  editingListId.value = null
  editListName.reset()
}

/**
 * Save the edited list name
 */
const handleSaveListEdit = async (listId: string) => {
  const trimmedValue = editListName.value.value.trim()
  
  // Don't save if value is empty
  if (!trimmedValue) {
    cancelListEdit()
    return
  }
  
  const list = lists.value.find(l => l.id === listId)
  
  // Check if name actually changed
  if (list && list.name === trimmedValue) {
    // No change, just cancel edit mode
    cancelListEdit()
    return
  }
  
  // Validate the new name
  const otherLists = store.allLists.filter(l => l.id !== listId)
  const isValid = editListName.validate(trimmedValue, otherLists)
  
  if (isValid) {
    store.editListName(listId, trimmedValue)
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
    showActionsForList.value = null
  }
  // Close create form when clicking outside, but not when clicking the New List button
  if (!target.closest('form') && !target.closest('button')) {
    if (showCreateForm.value && lists.value.length > 0) {
      showCreateForm.value = false
      newListName.reset()
    }
  }
}

// Watch for store changes and sync local state
watch(() => store.activeListId, (newId) => {
  selectedListId.value = newId
})

// Auto-show create form when component mounts if no lists exist
onMounted(async () => {
  await nextTick()
  // Only show create form if no lists exist yet
  if (lists.value.length === 0) {
    showCreateForm.value = true
    await nextTick()
    newListInput.value?.focus()
  }
  
  // Add click listener to close dropdowns
  document.addEventListener('click', closeDropdowns)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns)
})
</script>