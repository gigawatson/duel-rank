<!--
  ConfirmationModal Component
  
  Beautiful confirmation modal that replaces browser confirm dialogs.
  Supports different types (delete, reset, warning) with appropriate styling.
-->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="handleCancel">
    <div @click.stop class="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="iconClasses">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path v-if="type === 'delete'" fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" />
              <path v-else-if="type === 'reset'" fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" />
              <path v-else fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">{{ title }}</h2>
            <p v-if="subtitle" class="text-sm text-gray-600">{{ subtitle }}</p>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="p-6">
        <p class="text-gray-700 leading-relaxed">{{ message }}</p>
      </div>

      <!-- Actions -->
      <div class="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
        <button 
          @click="handleCancel"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer"
        >
          {{ cancelText }}
        </button>
        <button 
          @click="handleConfirm"
          class="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer"
          :class="confirmButtonClasses"
        >
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isOpen: boolean
  type?: 'delete' | 'reset' | 'warning'
  title: string
  subtitle?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface Emits {
  (e: 'confirm'): void
  (e: 'dismiss'): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'warning',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

const emit = defineEmits<Emits>()

const iconClasses = computed(() => {
  switch (props.type) {
    case 'delete':
      return 'bg-gradient-to-br from-red-500 to-red-600 text-white'
    case 'reset':
      return 'bg-gradient-to-br from-yellow-500 to-orange-500 text-white'
    default:
      return 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white'
  }
})

const confirmButtonClasses = computed(() => {
  switch (props.type) {
    case 'delete':
      return 'bg-red-600 hover:bg-red-700'
    case 'reset':
      return 'bg-orange-600 hover:bg-orange-700'
    default:
      return 'bg-blue-600 hover:bg-blue-700'
  }
})

const handleConfirm = () => {
  emit('confirm')
}

const handleCancel = () => {
  emit('dismiss')
}
</script>