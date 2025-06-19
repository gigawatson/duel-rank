<!--
  ComparisonHeader Component
  
  Beautiful, clean header for comparison mode showing the active list
  with elegant list switching and key statistics.
-->
<template>
  <div class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-violet-500 to-slate-700 rounded-xl">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
    
    <div class="relative p-6">
      <div class="flex items-center justify-between">
        <!-- Main List Info -->
        <div class="flex items-center space-x-4">
          <!-- List Icon -->
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg flex items-center justify-center inset-ring inset-ring-violet-700/30">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-7 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
          </div>
          
          <!-- List Details -->
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <h1 class="text-2xl font-bold text-white">{{ activeList?.name || 'No List Selected' }}</h1>
              <span class="px-3 py-1.5 text-xs font-medium bg-white/20 text-white/90 rounded-full">Ranking Mode</span>
            </div>
            
            <!-- Stats Row -->
            <div class="text-sm font-medium text-white/80">
              {{ activeList?.items.length || 0 }} items • {{ getCompletedComparisons(activeList) }} comparisons • {{ formatDate(activeList?.createdAt) }}
            </div>
          </div>
        </div>

        <!-- List Switcher -->
        <div v-if="lists.length > 1" class="flex items-center space-x-3">
          <span class="text-sm font-medium text-white/80">Switch List:</span>
          <div class="relative">
            <button
              ref="dropdownButton"
              @click="toggleDropdown"
              class="flex items-center space-x-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200 group cursor-pointer"
            >
              <span class="text-sm font-medium text-white">{{ lists.length }} lists</span>
              <svg class="w-4 h-4 text-white/70 group-hover:text-white transition-colors" :class="{ 'rotate-180': showListSelector }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Dropdown rendered outside container to avoid clipping -->
  <Teleport to="body">
    <div v-if="showListSelector && dropdownPosition" 
         data-dropdown
         class="fixed w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
         :style="{ top: dropdownPosition.top + 'px', left: dropdownPosition.left + 'px' }">
      <div class="p-2">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Select List</div>
        <div class="space-y-1">
          <button
            v-for="list in lists"
            :key="list.id"
            @click="handleSwitchList(list.id)"
            class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-100/80 transition-colors group flex items-center justify-between cursor-pointer"
            :class="list.id === selectedListId ? 'bg-indigo-50 border border-indigo-200 hover:bg-indigo-50 hover:cursor-default' : ''"
          >
            <span class="flex-1 min-w-0">
              <span class="font-medium text-gray-900 truncate block">{{ list.name }}</span>
              <span class="text-xs text-gray-500 block">
                {{ list.items.length }} items • {{ getCompletedComparisons(list) }} comparisons
              </span>
            </span>
            <span v-if="list.id === selectedListId" class="ml-2 w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0"></span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useListStore } from '../stores/useListStore'
import { validateListForComparison } from '../utils/validation'
import { getCompletedComparisons } from '../utils/comparison'

// Store access
const store = useListStore()

// Local state
const selectedListId = ref(store.activeListId)
const showListSelector = ref(false)
const dropdownButton = ref<HTMLElement>()
const dropdownPosition = ref<{ top: number; left: number } | null>(null)

// Computed properties
const lists = computed(() => store.allLists.filter(list => validateListForComparison(list.items)))
const activeList = computed(() => store.list)

/**
 * Calculate dropdown position based on button position
 */
const calculateDropdownPosition = () => {
  if (!dropdownButton.value) return
  
  const rect = dropdownButton.value.getBoundingClientRect()
  const dropdownWidth = 256 // w-64 = 16rem = 256px
  
  dropdownPosition.value = {
    top: rect.bottom + 8, // 8px gap
    left: rect.right - dropdownWidth // right-aligned
  }
}

/**
 * Toggle dropdown and calculate position
 */
const toggleDropdown = async () => {
  if (!showListSelector.value) {
    await nextTick()
    calculateDropdownPosition()
  }
  showListSelector.value = !showListSelector.value
}

/**
 * Switches to the selected list and closes dropdown
 */
const handleSwitchList = (listId: string) => {
  store.switchList(listId)
  selectedListId.value = listId
  showListSelector.value = false
  dropdownPosition.value = null
}

/**
 * Format date for display with better formatting
 */
const formatDate = (timestamp?: number): string => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  })
}

/**
 * Close dropdown when clicking outside
 */
const closeDropdown = (event: Event) => {
  const target = event.target as HTMLElement
  // Check if click is outside both the button and the dropdown
  if (!dropdownButton.value?.contains(target) && !target.closest('[data-dropdown]')) {
    showListSelector.value = false
    dropdownPosition.value = null
  }
}

// Watch for store changes and sync local state
watch(() => store.activeListId, (newId) => {
  selectedListId.value = newId
})

// Setup click outside listener
onMounted(() => {
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>