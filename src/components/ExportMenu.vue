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
      class="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium cursor-pointer"
      title="Export rankings"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
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
      class="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="p-4">
        <h3 class="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
          <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"></path>
          </svg>
          <span>Export Rankings</span>
        </h3>
        
        <!-- Export Format Options -->
        <div class="space-y-2">
          <!-- JSON Export -->
          <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex-1">
              <div class="font-medium text-gray-800">JSON</div>
              <div class="text-xs text-gray-500">Complete data with metadata</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('json')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
                :disabled="isExporting"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('json')"
                class="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors cursor-pointer"
                :disabled="isExporting"
              >
                Download
              </button>
            </div>
          </div>

          <!-- CSV Export -->
          <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex-1">
              <div class="font-medium text-gray-800">CSV</div>
              <div class="text-xs text-gray-500">Spreadsheet-friendly format</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('csv')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
                :disabled="isExporting"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('csv')"
                class="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors cursor-pointer"
                :disabled="isExporting"
              >
                Download
              </button>
            </div>
          </div>

          <!-- Markdown Export -->
          <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex-1">
              <div class="font-medium text-gray-800">Markdown</div>
              <div class="text-xs text-gray-500">Human-readable format with metadata</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('markdown')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
                :disabled="isExporting"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('markdown')"
                class="px-3 py-2 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors cursor-pointer"
                :disabled="isExporting"
              >
                Download
              </button>
            </div>
          </div>

          <!-- Simple List Export -->
          <div class="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
            <div class="flex-1">
              <div class="font-medium text-gray-800">Simple List</div>
              <div class="text-xs text-gray-500">Clean numbered list only</div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="handleCopy('simple')"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors cursor-pointer"
                title="Copy to clipboard"
                :disabled="isExporting"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
              </button>
              <button
                @click="handleExport('simple')"
                class="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                :disabled="isExporting"
              >
                Download
              </button>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="isExporting" class="mt-3 p-2 bg-blue-50 rounded-lg">
          <div class="flex items-center space-x-2 text-blue-700">
            <div class="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm">Exporting...</span>
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
const { isExporting, exportError, exportRanking, copyToClipboard, clearError } = useExport()

// Local state
const showDropdown = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const showMessage = ref(false)

// Methods
const handleExport = async (format: ExportFormat) => {
  await exportRanking(props.list, format, props.getLabelFn)
  
  if (exportError.value) {
    showErrorMessage(exportError.value)
  } else {
    showSuccessMessage(`Ranking exported as ${format.toUpperCase()}`)
    showDropdown.value = false
  }
}

const handleCopy = async (format: ExportFormat) => {
  const success = await copyToClipboard(props.list, format, props.getLabelFn)
  
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