<!--
  ComparisonLog Component
  
  Displays a log of recent comparisons for reference.
-->
<template>
  <div v-if="log.length > 0">
    <h2 class="text-lg font-bold mb-2">Recent Comparisons</h2>
    <div class="bg-gray-50 rounded p-3 max-h-32 overflow-y-auto">
      <ul class="text-sm text-gray-600 space-y-1">
        <li 
          v-for="(entry, index) in log" 
          :key="index"
          class="text-xs leading-relaxed"
        >
          {{ entry }}
        </li>
      </ul>
    </div>
    
    <button 
      v-if="log.length > 10"
      @click="$emit('clearLog')"
      class="text-xs text-gray-500 mt-1 hover:text-gray-700 transition-colors"
    >
      Clear log
    </button>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the ComparisonLog component
 */
interface Props {
  log: readonly string[]  // Array of log entries
}

/**
 * Events emitted by the ComparisonLog component
 */
interface Emits {
  clearLog: []  // When user wants to clear the log
}

defineProps<Props>()
defineEmits<Emits>()
</script>