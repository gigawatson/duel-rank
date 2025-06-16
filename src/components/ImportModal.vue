<!--
  ImportModal Component
  
  Modal for importing items in bulk via text input or file upload.
  Supports various formats with preview and duplicate handling.
-->
<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="closeModal">
    <div @click.stop class="bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-br from-violet-100 to-violet-300 ring-1 ring-violet-300 inset-ring inset-ring-white rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-violet-800">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-800">Import Items</h2>
            <p class="text-sm text-gray-600">Add multiple items to "{{ listName }}"</p>
          </div>
        </div>
        <button 
          @click="closeModal"
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
        <!-- Tab Navigation -->
        <div class="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          <button 
            @click="activeTab = 'text'"
            class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
            :class="activeTab === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                <path fill-rule="evenodd" d="M4.5 2A1.5 1.5 0 0 0 3 3.5v13A1.5 1.5 0 0 0 4.5 18h11a1.5 1.5 0 0 0 1.5-1.5V7.621a1.5 1.5 0 0 0-.44-1.06l-4.12-4.122A1.5 1.5 0 0 0 11.378 2H4.5Zm2.25 8.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Zm0 3a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5Z" clip-rule="evenodd" />
              </svg>
              <span>Text Input</span>
            </span>
          </button>
          <button 
            @click="activeTab = 'file'"
            class="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer"
            :class="activeTab === 'file' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            <span class="flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
                <path fill-rule="evenodd" d="M3.75 3A1.75 1.75 0 0 0 2 4.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 18 15.25v-8.5A1.75 1.75 0 0 0 16.25 5h-4.836a.25.25 0 0 1-.177-.073L9.823 3.513A1.75 1.75 0 0 0 8.586 3H3.75ZM10 8a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 10 8Z" clip-rule="evenodd" />
              </svg>
              <span>File Upload</span>
            </span>
          </button>
        </div>

        <!-- Text Input Tab -->
        <div v-if="activeTab === 'text'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Enter items (one per line or comma-separated)
            </label>
            <textarea 
              ref="textInputEl"
              v-model="textInput" 
              @input="parseTextInput"
              placeholder="Pizza&#10;Burger&#10;Sushi&#10;&#10;Or: Pizza, Burger, Sushi"
              class="w-full h-37 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Supports line-separated, comma-separated, or numbered lists.
            </p>
          </div>
        </div>

        <!-- File Upload Tab -->
        <div v-if="activeTab === 'file'" class="space-y-4">
          <div 
            @dragover.prevent
            @dragenter.prevent
            @drop.prevent="handleFileDrop"
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            :class="{ 'border-blue-500 bg-blue-50': isDragging }"
            @dragenter="isDragging = true"
            @dragleave="isDragging = false"
            @drop="isDragging = false"
          >
            <div class="space-y-3">
              <div class="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
                  <path fill-rule="evenodd" d="M19.5 21a3 3 0 0 0 3-3V9a3 3 0 0 0-3-3h-5.379a.75.75 0 0 1-.53-.22L11.47 3.66A2.25 2.25 0 0 0 9.879 3H4.5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h15Zm-6.75-10.5a.75.75 0 0 0-1.5 0v4.19l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V10.5Z" clip-rule="evenodd" />
                </svg>
              </div>
              <div>
                <p class="text-lg font-medium text-gray-700">Drop files here</p>
                <p class="text-sm text-gray-500">or click to browse</p>
              </div>
              <input 
                ref="fileInputEl"
                type="file" 
                accept=".txt,.csv"
                @change="handleFileSelect"
                class="hidden"
              />
              <button 
                @click="fileInputEl?.click()"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Choose File
              </button>
              <p class="text-xs text-gray-400 mt-6">
                Supports TXT and CSV files (max 1MB).
              </p>
            </div>
          </div>
          
          <div v-if="fileName" class="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="size-5">
              <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
            </svg>
            <span class="text-sm font-medium text-gray-700">{{ fileName }}</span>
            <button 
              @click="clearFile"
              class="ml-auto text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Preview Section -->
        <div v-if="parsedItems.length > 0" class="mt-6 border-t border-t-violet-800/10 pt-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-medium text-gray-800">Preview ({{ parsedItems.length }} items)</h3>
            <div class="flex items-center space-x-4">
              <!-- Duplicate Handling -->
              <div class="flex items-center space-x-2">
                <label class="text-sm text-gray-600">Duplicates:</label>
                <select 
                  v-model="duplicateAction"
                  class="text-sm border border-gray-300 rounded px-2 py-1 focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
                >
                  <option value="skip">Skip</option>
                  <option value="replace">Replace</option>
                  <option value="append">Append Number</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Items Preview -->
          <div class="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
            <div class="space-y-1 p-3">
              <div 
                v-for="(item, index) in parsedItems" 
                :key="index"
                class="flex items-center justify-between py-1"
              >
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">{{ item.text }}</span>
                  <span v-if="item.isDuplicate && duplicateAction === 'append'" class="text-xs text-blue-600">
                    → {{ generateUniqueItemName(item.text) }}
                  </span>
                </div>
                <div class="flex items-center space-x-1">
                  <span v-if="item.isDuplicate" class="px-2 py-1 text-xs rounded"
                    :class="{
                      'bg-yellow-100 text-yellow-700': duplicateAction === 'skip',
                      'bg-orange-100 text-orange-700': duplicateAction === 'replace',
                      'bg-blue-100 text-blue-700': duplicateAction === 'append'
                    }"
                  >
                    {{ duplicateAction === 'skip' ? 'Will Skip' : duplicateAction === 'replace' ? 'Will Replace' : 'Will Append' }}
                  </span>
                  <span v-if="item.hasError" class="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                    Error
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="mt-3 text-sm text-gray-600">
            <span class="font-medium text-green-600">{{ newItemsCount }}</span> new items, 
            <span class="font-medium text-yellow-600">{{ duplicateCount }}</span> duplicates
            <span v-if="errorCount > 0">, <span class="font-medium text-red-600">{{ errorCount }}</span> errors</span>
          </div>
        </div>

        <!-- Error Messages -->
        <div v-if="errorMessage" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center space-x-2">
            <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm text-red-700">{{ errorMessage }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between p-6 border-t border-gray-200">
        <button 
          @click="closeModal"
          class="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button 
          @click="importItems"
          :disabled="!canImport"
          class="px-6 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          Import {{ newItemsCount }} Item{{ newItemsCount === 1 ? '' : 's' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'

// Props
interface Props {
  isOpen: boolean
  listName: string
  existingItems: string[]
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'close'): void
  (e: 'import', data: { items: string[], duplicateAction: 'skip' | 'replace' | 'append', duplicateItems: string[] }): void
}

const emit = defineEmits<Emits>()

// Local state
const activeTab = ref<'text' | 'file'>('text')
const textInput = ref('')
const fileName = ref('')
const isDragging = ref(false)
const duplicateAction = ref<'skip' | 'replace' | 'append'>('skip')
const errorMessage = ref('')

// Template refs
const textInputEl = ref<HTMLTextAreaElement>()
const fileInputEl = ref<HTMLInputElement>()

// Parsed items state
interface ParsedItem {
  text: string
  isDuplicate: boolean
  hasError: boolean
}

const parsedItems = ref<ParsedItem[]>([])

// Computed properties
const newItemsCount = computed(() => {
  let count = 0
  for (const item of parsedItems.value) {
    if (item.hasError) continue
    
    if (item.isDuplicate) {
      // Only count duplicates if we're replacing or appending
      if (duplicateAction.value === 'replace' || duplicateAction.value === 'append') {
        count++
      }
    } else {
      count++
    }
  }
  return count
})

const duplicateCount = computed(() => 
  parsedItems.value.filter(item => item.isDuplicate).length
)

const errorCount = computed(() => 
  parsedItems.value.filter(item => item.hasError).length
)

const canImport = computed(() => newItemsCount.value > 0)

/**
 * Parses text input and identifies items
 */
const parseTextInput = () => {
  errorMessage.value = ''
  const text = textInput.value.trim()
  
  if (!text) {
    parsedItems.value = []
    return
  }
  
  try {
    const items = parseText(text)
    parsedItems.value = items.map(item => ({
      text: item,
      isDuplicate: props.existingItems.some(existing => 
        existing.toLowerCase() === item.toLowerCase()
      ),
      hasError: !isValidItem(item)
    }))
  } catch (error) {
    errorMessage.value = 'Failed to parse input. Please check the format.'
    parsedItems.value = []
  }
}

/**
 * Parses text in various formats
 */
const parseText = (text: string): string[] => {
  // Split by newlines first
  let items = text.split(/\r?\n/)
  
  // If we only have one line, try comma separation
  if (items.length === 1 && items[0].includes(',')) {
    items = items[0].split(',')
  }
  
  return items
    .map(item => {
      // Remove common prefixes (numbers, bullets, dashes)
      return item
        .replace(/^\s*\d+[.)]\s*/, '') // "1. " or "1) "
        .replace(/^\s*[•\-*]\s*/, '')  // "• " or "- " or "* "
        .trim()
    })
    .filter(item => item.length > 0)      // Remove empty items
    .slice(0, 100)                        // Limit to 100 items
}

/**
 * Validates individual item
 */
const isValidItem = (item: string): boolean => {
  return item.length > 0 && item.length <= 100 // Basic validation
}

/**
 * Handles file drop
 */
const handleFileDrop = (event: DragEvent) => {
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

/**
 * Handles file selection
 */
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

/**
 * Processes uploaded file
 */
const processFile = (file: File) => {
  errorMessage.value = ''
  
  // File size check (1MB limit)
  if (file.size > 1024 * 1024) {
    errorMessage.value = 'File too large. Please use files smaller than 1MB.'
    return
  }
  
  // File type check
  const allowedTypes = ['text/plain', 'text/csv', 'application/csv']
  if (!allowedTypes.includes(file.type) && !file.name.match(/\.(txt|csv)$/i)) {
    errorMessage.value = 'Invalid file type. Please use TXT or CSV files.'
    return
  }
  
  fileName.value = file.name
  
  const reader = new FileReader()
  reader.onload = (e) => {
    textInput.value = e.target?.result as string
    parseTextInput()
  }
  reader.onerror = () => {
    errorMessage.value = 'Failed to read file. Please try again.'
  }
  reader.readAsText(file)
}

/**
 * Clears selected file
 */
const clearFile = () => {
  fileName.value = ''
  textInput.value = ''
  parsedItems.value = []
  if (fileInputEl.value) {
    fileInputEl.value.value = ''
  }
}

/**
 * Generates a unique item name by appending numbers
 */
const generateUniqueItemName = (originalName: string): string => {
  const allExistingNames = [
    ...props.existingItems,
    ...parsedItems.value.filter(item => !item.isDuplicate).map(item => item.text)
  ]
  
  let counter = 2
  let newName = `${originalName} (${counter})`
  
  // Keep incrementing until we find a unique name
  while (allExistingNames.some(existing => existing.toLowerCase() === newName.toLowerCase())) {
    counter++
    newName = `${originalName} (${counter})`
  }
  
  return newName
}

/**
 * Imports the items
 */
const importItems = () => {
  let itemsToImport: string[] = []
  const duplicateItems: string[] = []
  
  for (const item of parsedItems.value) {
    // Skip items with errors
    if (item.hasError) continue
    
    if (item.isDuplicate) {
      duplicateItems.push(item.text)
      
      // Handle duplicates based on selected action
      switch (duplicateAction.value) {
        case 'skip':
          // Don't include duplicates
          continue
        case 'replace':
          // Include duplicates (they will replace existing items)
          itemsToImport.push(item.text)
          break
        case 'append':
          // Append number to make unique
          itemsToImport.push(generateUniqueItemName(item.text))
          break
      }
    } else {
      // Not a duplicate, include it
      itemsToImport.push(item.text)
    }
  }
  
  emit('import', { 
    items: itemsToImport, 
    duplicateAction: duplicateAction.value,
    duplicateItems 
  })
  closeModal()
}

/**
 * Closes the modal
 */
const closeModal = () => {
  // Reset state
  activeTab.value = 'text'
  textInput.value = ''
  fileName.value = ''
  parsedItems.value = []
  errorMessage.value = ''
  
  emit('close')
}

// Auto-focus text input when modal opens
watch(() => props.isOpen, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    textInputEl.value?.focus()
  }
})
</script>

<style scoped>
/* Custom scrollbar for preview */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>