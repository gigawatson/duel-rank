<!--
  ItemManager Component
  
  Beautiful, modern item management interface with drag & drop sorting,
  inline editing, and smooth animations.
-->
<template>
  <div class="space-y-6">
    <!-- Items Management -->
    <div class="bg-violet-50/30 border border-violet-800/10 rounded-xl p-6">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-300 ring-1 ring-violet-300 inset-ring inset-ring-white rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h3 class="font-semibold text-gray-800 flex items-center space-x-1.5">
                <span>Items in the</span>
                <span class="px-2 py-1 text-xs bg-indigo-600 text-white rounded-md">{{ currentListName }}</span>
                <span>list</span>
              </h3>
            </div>
            <p class="text-sm text-gray-600">Add and manage items for this list</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <div v-if="items.length > 0" class="text-sm text-gray-500">
            {{ items.length }} item{{ items.length === 1 ? '' : 's' }}
          </div>
          <button 
            @click="showImportModal = true"
            class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-800/20 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
            </svg>
            <span>Import Items</span>
          </button>
        </div>
      </div>

      <!-- Add New Item Form -->
      <div class="mb-8">
        <form @submit.prevent="handleAddItem" class="space-y-3">
          <div class="flex space-x-3">
            <div class="flex-1">
              <input 
                ref="itemInput"
                v-model="newItemLabel.value.value" 
                @input="clearItemError"
                :placeholder="`Add item to &quot;${currentListName}&quot;...`"
                class="w-full p-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors"
                :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': newItemLabel.error }"
              />
            </div>
            <button 
              type="submit" 
              class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 cursor-pointer"
              :disabled="!newItemLabel.value.value.trim()"
            >
              <span>Add</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
        </form>

        <!-- Validation Error Display -->
        <p v-if="newItemLabel.error && newItemLabel.error.value && newItemLabel.error.value.length > 0" class="text-sm text-red-600 mt-2 flex items-center space-x-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ newItemLabel.error?.value }}</span>
        </p>
      </div>

      <!-- Items List -->
      <div v-if="items.length > 0">
        <div class="border-t border-violet-800/10 pt-8">
          <h4 class="font-medium text-gray-800 mb-6 flex items-center space-x-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="size-5.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
            </svg>
            <span>Current Items <span class="opacity-60">({{ items.length }})</span></span>
          </h4>

        <TransitionGroup name="item-list" tag="div" class="space-y-3">
          <div
            v-for="(item, index) in items" 
            :key="item.id" 
            class="group relative bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-lg p-4 hover:border-violet-300 hover:shadow-sm transition-all duration-200"
          >
            <!-- Item Number Badge -->
            <div class="absolute -left-2 -top-2 w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full flex items-center justify-center z-10 border border-violet-600 inset-ring inset-ring-white/30">
              <span class="text-xs font-semibold text-white">{{ index + 1 }}</span>
            </div>

            <!-- Edit Mode -->
            <div v-if="editingItemId === item.id" class="flex items-center space-x-3 pl-4">
              <div class="flex-1">
                <input 
                  ref="editInput"
                  v-model="editItemLabel.value.value"
                  @keyup.enter="handleSaveEdit(item.id)"
                  @keyup.esc="cancelEdit"
                  @blur="handleSaveEdit(item.id)"
                  class="w-full p-3 border border-blue-300 rounded-lg text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': editItemLabel.error }"
                />
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  @click="handleSaveEdit(item.id)"
                  class="px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Save changes"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span class="text-sm font-medium">Save</span>
                </button>
                <button 
                  @click="cancelEdit"
                  class="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  title="Cancel edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                  <span class="text-sm font-medium">Cancel</span>
                </button>
              </div>
            </div>

            <!-- View Mode -->
            <div v-else class="flex items-center justify-between pl-4">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ item.label }}</h4>
                <p class="text-xs text-gray-500">Added {{ formatItemDate(item.createdAt) }}</p>
              </div>
              <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button 
                  @click="startEdit(item.id, item.label)" 
                  class="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  :title="`Edit ${item.label}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  <span class="text-sm font-medium">Edit</span>
                </button>
                <button 
                  @click="handleRemoveItem(item.id, item.label)" 
                  class="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1 cursor-pointer"
                  :title="`Remove ${item.label}`"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  <span class="text-sm font-medium">Remove</span>
                </button>
              </div>
            </div>
          </div>
          </TransitionGroup>
          
          <!-- Edit Validation Error -->
          <p v-if="editItemLabel.error && editItemLabel.error.value && editItemLabel.error.value.length > 0" class="text-sm text-red-600 mt-3 flex items-center space-x-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>{{ editItemLabel.error?.value }}</span>
          </p>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="border-t pt-6">
        <div class="text-center py-8">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
            <span class="text-2xl text-white">📝</span>
          </div>
          <h4 class="text-lg font-semibold text-gray-700 mb-2">
            <span class="text-blue-600">"{{ currentListName }}"</span> is empty
          </h4>
          <p class="text-gray-500 mb-4">Add at least 2 items to start comparing and ranking this list</p>
          <div class="flex items-center justify-center space-x-2 text-sm text-gray-400">
            <span>💡</span>
            <span>Tip: Add items like "Pizza", "Burger", "Sushi" to rank your favorites</span>
          </div>
        </div>
      </div>
    </div>


    <!-- Comparison Readiness Indicator -->
    <div v-if="items.length >= 2" class="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
          <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <div>
          <p class="font-semibold text-green-800">
            <span class="text-blue-600">"{{ currentListName }}"</span> is ready for comparison!
          </p>
          <p class="text-sm text-green-600">{{ items.length }} items ready to rank</p>
        </div>
      </div>
    </div>
    <div v-else-if="items.length === 1" class="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-sm">{{ items.length }}</span>
        </div>
        <div>
          <p class="font-semibold text-yellow-800">
            Add 1 more item to <span class="text-blue-600">"{{ currentListName }}"</span>
          </p>
          <p class="text-sm text-yellow-600">You need at least 2 items to start comparing</p>
        </div>
      </div>
    </div>

    <!-- Import Modal -->
    <ImportModal 
      :is-open="showImportModal"
      :list-name="currentListName"
      :existing-items="items.map(item => item.label)"
      @close="showImportModal = false"
      @import="handleImportItems"
    />

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
      @cancel="handleCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from 'vue'
import { useListStore } from '../stores/useListStore'
import { useValidatedInput } from '../composables/useFormValidation'
import { useConfirmation } from '../composables/useConfirmation'
import { validateItemName } from '../utils/validation'
import ImportModal from './ImportModal.vue'
import ConfirmationModal from './ConfirmationModal.vue'

// Store access
const store = useListStore()

// Confirmation modal
const { confirmationState, showConfirmation, handleConfirm, handleCancel } = useConfirmation()

// Template refs
const itemInput = ref<HTMLInputElement>()
const editInput = ref<HTMLInputElement>()

// Form handling with validation
const newItemLabel = useValidatedInput('', validateItemName)
const editItemLabel = useValidatedInput('', validateItemName)

// Edit state
const editingItemId = ref<string | null>(null)

// Import modal state
const showImportModal = ref(false)

// Computed properties
const items = computed(() => store.list.items)
const currentListName = computed(() => store.list.name || 'Untitled List')

/**
 * Handles item addition with validation
 */
const handleAddItem = async () => {
  const trimmedValue = newItemLabel.value.value.trim()
  const isValid = newItemLabel.validate(trimmedValue, store.list.items)
  
  if (isValid) {
    store.addItem(trimmedValue)
    newItemLabel.reset()
    
    // Focus back to input for quick multiple additions
    await nextTick()
    itemInput.value?.focus()
  }
}

/**
 * Clears the item name validation error
 */
const clearItemError = () => {
  newItemLabel.clearError?.()
}

/**
 * Handles item removal with confirmation
 * @param id - Item ID to remove
 * @param label - Item label for confirmation dialog
 */
const handleRemoveItem = async (id: string, label: string) => {
  const confirmed = await showConfirmation({
    type: 'delete',
    title: 'Remove Item',
    subtitle: 'This will remove the item from your list',
    message: `Are you sure you want to remove "${label}" from the list? This action cannot be undone.`,
    confirmText: 'Remove Item',
    cancelText: 'Cancel'
  })
  
  if (confirmed) {
    store.removeItem(id)
  }
}

/**
 * Start editing an item
 * @param id - Item ID to edit
 * @param currentLabel - Current item label
 */
const startEdit = async (id: string, currentLabel: string) => {
  editingItemId.value = id
  editItemLabel.reset()
  editItemLabel.value.value = currentLabel
  
  // Focus the edit input after Vue updates the DOM
  await nextTick()
  if (editInput.value && typeof editInput.value.focus === 'function') {
    editInput.value.focus()
    editInput.value.select()
  }
}

/**
 * Cancel editing
 */
const cancelEdit = () => {
  editingItemId.value = null
  editItemLabel.reset()
}

/**
 * Save the edited item
 * @param id - Item ID being edited
 */
const handleSaveEdit = async (id: string) => {
  const trimmedValue = editItemLabel.value.value.trim()
  
  // Don't save if value is empty
  if (!trimmedValue) {
    cancelEdit()
    return
  }
  
  // Get current item to check if label actually changed
  const currentItem = store.list.items.find(item => item.id === id)
  if (currentItem && currentItem.label === trimmedValue) {
    // No change, just cancel edit mode
    cancelEdit()
    return
  }
  
  // Validate the new label
  const otherItems = store.list.items.filter(item => item.id !== id)
  const isValid = editItemLabel.validate(trimmedValue, otherItems)
  
  if (isValid) {
    store.editItem(id, trimmedValue)
    cancelEdit()
  }
  // If not valid, stay in edit mode to show error
}

/**
 * Format item creation date for display
 */
const formatItemDate = (timestamp: number): string => {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`
  if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  return 'just now'
}

/**
 * Handles importing multiple items
 */
const handleImportItems = async (importedItems: string[]) => {
  for (const itemLabel of importedItems) {
    store.addItem(itemLabel)
  }
  
  // Focus back to the regular item input after import
  await nextTick()
  itemInput.value?.focus()
}

/**
 * Auto-focus the item input when component mounts, 
 * especially when we have an empty list (just created)
 */
onMounted(async () => {
  await nextTick()
  // Focus the item input if the current list has no items
  // This handles the case where user just created their first list
  if (items.value.length === 0) {
    itemInput.value?.focus()
  }
})
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
/* Item list transition animations */
.item-list-enter-active,
.item-list-leave-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.item-list-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.item-list-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.item-list-move {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Hover glow effect for cards */
.group:hover {
  box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.1);
}

/* Focus ring styling */
input:focus {
  box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
}

input.border-red-500:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
</style>