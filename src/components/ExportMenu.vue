<!--
  ExportMenu Component
  
  Provides export functionality for ranking data in multiple formats.
  Features dropdown menu with format options and copy to clipboard.
-->
<template>
  <div class="relative">
    <!-- Export Button -->
    <button
      @click="showDropdown = !showDropdown"
      class="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-violet-700 bg-white border border-violet-800/20 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors cursor-pointer"
      title="Export rankings"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-4">
        <path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
        <path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
      </svg>
      <span>Export</span>
      <svg class="w-4 h-4" :class="{ 'rotate-180': showDropdown }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>

    <!-- Dropdown Menu -->
    <div 
      v-if="showDropdown" 
      @click.stop
      class="absolute right-0 top-full mt-2 w-72 border border-gray-300 rounded-lg shadow-lg z-50 bg-gray-50"
    >
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <span>Export Rankings</span>
        </h3>
        
        <!-- Export Format Options -->
        <div class="space-y-2">
          <!-- JSON Export -->
          <div class="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
            <div class="flex-1">
              <div class="font-medium text-gray-800">JSON</div>
              <div class="text-xs text-gray-500 pr-1">Complete data w/ metadata</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('json')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('json')"
                class="px-3 py-2 text-sm bg-indigo-100 text-indigo-900 rounded hover:bg-indigo-200 transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          <!-- CSV Export -->
          <div class="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
            <div class="flex-1">
              <div class="font-medium text-gray-800">CSV</div>
              <div class="text-xs text-gray-500 pr-1">Spreadsheet-friendly format</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('csv')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('csv')"
                class="px-3 py-2 text-sm bg-amber-100 text-amber-900 rounded hover:bg-amber-200 transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          <!-- Markdown Export -->
          <div class="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
            <div class="flex-1">
              <div class="font-medium text-gray-800">Markdown</div>
              <div class="text-xs text-gray-500 pr-1">Human-readable w/ metadata</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('markdown')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('markdown')"
                class="px-3 py-2 text-sm bg-emerald-100 text-emerald-900 rounded hover:bg-emerald-200 transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

          <!-- Simple List Export -->
          <div class="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-white">
            <div class="flex-1">
              <div class="font-medium text-gray-800">Simple List</div>
              <div class="text-xs text-gray-500 pr-1">Clean numbered list only</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('simple')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('simple')"
                class="px-3 py-2 text-sm bg-fuchsia-100 text-fuchsia-900 rounded hover:bg-fuchsia-200 transition-colors cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>
        </div>


        <!-- Success/Error Messages -->
        <div v-if="showMessage" class="mt-3 p-2 rounded-lg" :class="messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
          <div class="flex items-center space-x-2">
            <svg v-if="messageType === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">{{ message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { List } from '../types'
import { useExport, type ExportFormat } from '../composables/useExport'

interface Props {
  list: List
  getLabelFn: (id: string) => string
}

const props = defineProps<Props>()

// Export composable
const { exportError, exportRanking, copyToClipboard, clearError } = useExport()

// Local state
const showDropdown = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showMessage = ref(false)

// Methods
const handleExport = async (format: ExportFormat) => {
  await exportRanking(props.list, format, props.getLabelFn)
  
  // Only show error messages for downloads (browser handles success feedback)
  if (exportError.value) {
    showErrorMessage(exportError.value)
  }
  // Don't auto-close dropdown so user can see any error messages
}

const handleCopy = async (format: ExportFormat) => {
  const success = await copyToClipboard(props.list, format, props.getLabelFn)
  
  // Show both success and error feedback for clipboard operations
  if (success) {
    showSuccessMessage(`${format.toUpperCase()} copied to clipboard`)
  } else {
    showErrorMessage(exportError.value || 'Failed to copy to clipboard')
  }
}

const showSuccessMessage = (msg: string) => {
  message.value = msg
  messageType.value = 'success'
  showMessage.value = true
  clearMessageAfterDelay()
}

const showErrorMessage = (msg: string) => {
  message.value = msg
  messageType.value = 'error'
  showMessage.value = true
  clearMessageAfterDelay()
}

const clearMessageAfterDelay = () => {
  setTimeout(() => {
    showMessage.value = false
    clearError()
  }, 3000)
}

// Close dropdown when clicking outside
const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
}
</style>