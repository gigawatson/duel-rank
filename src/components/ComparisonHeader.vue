<!--
  ComparisonHeader Component
  
  Beautiful, clean header for comparison mode showing the active list
  with elegant list switching and key statistics.
-->
<template>
  <div class="relative overflow-hidden bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-2xl">
    <!-- Background Pattern -->
    <div class="absolute inset-0 bg-black/10"></div>
    <div class="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
    
    <div class="relative p-6">
      <div class="flex items-center justify-between">
        <!-- Main List Info -->
        <div class="flex items-center space-x-4">
          <!-- List Icon -->
          <div class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h5.586a1 1 0 00.707-.293l5.414-5.414a1 1 0 00.293-.707V7a2 2 0 00-2-2H14m-5 0V3a1 1 0 011-1h3a1 1 0 011 1v2m-5 0h5m-5 4h5m-5 4h5"></path>
            </svg>
          </div>
          
          <!-- List Details -->
          <div>
            <div class="flex items-center space-x-2 mb-1">
              <h1 class="text-2xl font-bold text-white">{{ activeList?.name || 'No List Selected' }}</h1>
              <div class="px-2 py-1 bg-white/20 rounded-full">
                <span class="text-xs font-medium text-white/90">Ranking Mode</span>
              </div>
            </div>
            
            <!-- Stats Row -->
            <div class="flex items-center space-x-4 text-white/80">
              <div class="flex items-center space-x-1.5">
                <div class="w-1.5 h-1.5 bg-emerald-300 rounded-full"></div>
                <span class="text-sm font-medium">{{ activeList?.items.length || 0 }} items</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <div class="w-1.5 h-1.5 bg-blue-300 rounded-full"></div>
                <span class="text-sm font-medium">{{ activeList?.games.length || 0 }} comparisons</span>
              </div>
              <div class="flex items-center space-x-1.5">
                <div class="w-1.5 h-1.5 bg-amber-300 rounded-full"></div>
                <span class="text-sm font-medium">{{ formatDate(activeList?.createdAt) }}</span>
              </div>
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
              class="flex items-center space-x-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-200 group cursor-pointer"
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
         class="fixed w-64 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
         :style="{ top: dropdownPosition.top + 'px', left: dropdownPosition.left + 'px' }">
      <div class="p-2">
        <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-3 py-2">Select List</div>
        <div class="space-y-1">
          <button
            v-for="list in lists"
            :key="list.id"
            @click="handleSwitchList(list.id)"
            class="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group flex items-center justify-between cursor-pointer"
            :class="list.id === selectedListId ? 'bg-blue-50 border border-blue-200' : ''"
          >
            <span class="flex-1 min-w-0">
              <span class="font-medium text-gray-900 truncate block">{{ list.name }}</span>
              <span class="text-xs text-gray-500 block">
                {{ list.items.length }} items • {{ list.games.length }} comparisons
              </span>
            </span>
            <span v-if="list.id === selectedListId" class="ml-2 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useListStore } from '../stores/useListStore'

// Store access
const store = useListStore()

// Local state
const selectedListId = ref(store.activeListId)
const showListSelector = ref(false)
const dropdownButton = ref<HTMLElement>()
const dropdownPosition = ref<{ top: number; left: number } | null>(null)

// Computed properties
const lists = computed(() => store.allLists)
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