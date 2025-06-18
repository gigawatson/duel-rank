<!--
  ListManager Component
  
  Beautiful, modern list management interface with intuitive controls
  and smooth animations. Handles list creation, selection, and management.
-->
<template>
  <div class="space-y-6">
    <!-- List Management -->
    <div class="bg-violet-50/30 border border-violet-800/10 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-300 ring-1 ring-violet-300 inset-ring inset-ring-white rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
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
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-800/20 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
              <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
            </svg>
            <span>New List</span>
          </button>
        </div>
      </div>

      <!-- Existing Lists -->
      <div v-if="lists.length > 0" class="space-y-3">
        <div
          v-for="list in lists"
          :key="list.id"
          class="p-4 border rounded-lg transition-all duration-200"
          :class="[
            list.id === selectedListId 
              ? 'border-indigo-300 bg-indigo-50 ring-4 ring-indigo-200'
              : 'border-violet-800/10 hover:border-violet-300 hover:bg-violet-50'
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
                  class="font-medium w-full p-3 rounded-lg bg-white outline-0 border border-violet-800/20 focus:border-violet-500 focus:ring-4 focus:ring-violet-800/15 transition-colors"
                />
                <div class="flex items-center space-x-2">
                  <button 
                    @click="handleSaveListEdit(list.id)"
                    class="px-3 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span class="text-sm font-medium">Save</span>
                  </button>
                  <button 
                    @click="cancelListEdit"
                    class="px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-300 hover:text-gray-950 transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                    <span class="text-sm font-medium">Cancel</span>
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
                  <span v-if="list.id === selectedListId" class="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md">Active</span>
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
                  class="p-2 rounded-lg transition-colors cursor-pointer"
                  :class="[list.id === selectedListId ? 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-100' : 'text-violet-700 hover:text-violet-900 hover:bg-violet-100']"
                  title="List Actions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                  </svg>
                </button>
                
                <!-- Actions Dropdown -->
                <div v-if="showActionsForList === list.id" @click.stop class="absolute right-0 top-full mt-2 w-44 bg-white border border-violet-900/20 rounded-lg shadow-lg z-10">
                  <button 
                    @click="handleEditList(list.id)"
                    class="w-full px-3 py-2.5 text-left text-sm text-violet-900 hover:bg-violet-50 rounded-t-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.262a1.75 1.75 0 0 0 0-2.474Z" />
                      <path d="M4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7a.75.75 0 0 1 0 1.5H4.75Z" />
                    </svg>
                    <span>Edit Name</span>
                  </button>
                  <button 
                    @click="handleResetList(list.id)"
                    class="w-full px-3 py-2.5 text-left text-sm text-violet-900 hover:bg-violet-50 flex items-center space-x-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd" d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z" clip-rule="evenodd" />
                    </svg>
                    <span>Reset List Items</span>
                  </button>
                  <button 
                    @click="handleResetComparisons(list.id)"
                    class="w-full px-3 py-2.5 text-left text-sm text-violet-900 hover:bg-violet-50 flex items-center space-x-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd" d="M8 3.5c-.771 0-1.537.022-2.297.066a1.124 1.124 0 0 0-1.058 1.028l-.018.214a.75.75 0 1 1-1.495-.12l.018-.221a2.624 2.624 0 0 1 2.467-2.399 41.628 41.628 0 0 1 4.766 0 2.624 2.624 0 0 1 2.467 2.399c.056.662.097 1.329.122 2l.748-.748a.75.75 0 1 1 1.06 1.06l-2 2.001a.75.75 0 0 1-1.061 0l-2-1.999a.75.75 0 0 1 1.061-1.06l.689.688a39.89 39.89 0 0 0-.114-1.815 1.124 1.124 0 0 0-1.058-1.028A40.138 40.138 0 0 0 8 3.5ZM3.22 7.22a.75.75 0 0 1 1.061 0l2 2a.75.75 0 1 1-1.06 1.06l-.69-.69c.025.61.062 1.214.114 1.816.048.56.496.996 1.058 1.028a40.112 40.112 0 0 0 4.594 0 1.124 1.124 0 0 0 1.058-1.028 39.2 39.2 0 0 0 .018-.219.75.75 0 1 1 1.495.12l-.018.226a2.624 2.624 0 0 1-2.467 2.399 41.648 41.648 0 0 1-4.766 0 2.624 2.624 0 0 1-2.467-2.399 41.395 41.395 0 0 1-.122-2l-.748.748A.75.75 0 1 1 1.22 9.22l2-2Z" clip-rule="evenodd" />
                    </svg>
                    <span>Reset Comparisons</span>
                  </button>
                  <button 
                    @click="handleDeleteList(list.id)"
                    class="w-full px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center space-x-2 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                      <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                    </svg>
                    <span>Delete List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create New List Form (Compact) -->
      <div v-if="showCreateForm" class="border-t border-dashed border-t-violet-800/10 pt-6 mt-6">
        <form @submit.prevent="handleCreateList" class="space-y-3">
          <div class="flex space-x-2">
            <input 
              ref="newListInput"
              v-model="newListName.value.value" 
              @input="clearListError"
              @keyup.esc="hideCreateForm"
              placeholder="Enter new list name..."
              class="flex-1 p-3 rounded-lg bg-white outline-0 border border-violet-800/20 focus:border-violet-500 focus:ring-4 focus:ring-violet-800/15 transition-colors"
            />
            <button 
              type="submit" 
              class="px-6 py-3 bg-gradient-to-r from-violet-700 to-violet-950 hover:from-violet-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 cursor-pointer"
              :disabled="!newListName.value.value.trim()"
            >
              <span>Create</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
            <button 
              type="button"
              @click="hideCreateForm"
              class="px-6 py-3 text-sm font-medium text-gray-600 hover:text-violet-800 hover:bg-violet-100 rounded-lg transition-colors cursor-pointer"
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
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import { useListStore } from '../stores/useListStore'
import { useValidatedInput } from '../composables/useFormValidation'
import { useConfirmation } from '../composables/useConfirmation'
import { validateListName } from '../utils/validation'
import ConfirmationModal from './ConfirmationModal.vue'

// Define emits
const emit = defineEmits<{
  'list-switched': []
  'list-created': []
}>()

// Store access
const store = useListStore()

// Confirmation modal
const { confirmationState, showConfirmation, handleConfirm, handleCancel } = useConfirmation()

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
    // Emit event to notify parent that a new list was created
    emit('list-created')
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
  // Emit event to notify parent that list was switched
  emit('list-switched')
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
const handleResetList = async (listId: string) => {
  showActionsForList.value = null
  const list = lists.value.find(l => l.id === listId)
  const listName = list?.name || 'this list'
  
  const confirmed = await showConfirmation({
    type: 'reset',
    title: 'Reset List',
    subtitle: 'This will remove all items and comparisons',
    message: `Are you sure you want to reset "${listName}"? All items and comparisons will be lost and cannot be recovered.`,
    confirmText: 'Reset List',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
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
 * Resets comparisons for a specific list (keeps items, removes only games and comparison log)
 */
const handleResetComparisons = async (listId: string) => {
  showActionsForList.value = null
  const list = lists.value.find(l => l.id === listId)
  const listName = list?.name || 'this list'
  
  const confirmed = await showConfirmation({
    type: 'reset',
    title: 'Reset Comparisons',
    subtitle: 'This will remove all comparison data but keep your items',
    message: `Are you sure you want to reset comparisons for "${listName}"? All comparison history and rankings will be lost, but your items will remain.`,
    confirmText: 'Reset Comparisons',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    // Switch to the list first if it's not active
    if (listId !== selectedListId.value) {
      store.switchList(listId)
      selectedListId.value = listId
    }
    store.resetComparisons()
  }
}

/**
 * Deletes a specific list
 */
const handleDeleteList = async (listId: string) => {
  showActionsForList.value = null
  const list = lists.value.find(l => l.id === listId)
  const listName = list?.name || 'this list'
  
  const confirmed = await showConfirmation({
    type: 'delete',
    title: 'Delete List',
    subtitle: 'This action cannot be undone',
    message: `Are you sure you want to delete "${listName}"? This will permanently remove the list and all its items and comparisons.`,
    confirmText: 'Delete List',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
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
  // Get all elements with the editListInput ref (there might be multiple in the v-for)
  const inputs = editListInput.value
  if (inputs) {
    // If it's an array, find the visible one, otherwise use the single element
    const inputElement = Array.isArray(inputs) ? inputs.find(input => input?.offsetParent !== null) : inputs
    if (inputElement && typeof inputElement.focus === 'function') {
      inputElement.focus()
      inputElement.select()
    }
  }
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