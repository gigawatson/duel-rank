<!--
  ComparisonChoice Component
  
  Displays two items for pairwise comparison with choice buttons.
  Enhanced design to be the focal point of the comparison interface.
-->
<template>
  <div class="text-center space-y-10">
    <!-- Main Question -->
    <div>
      <h2 class="text-3xl md:text-4xl font-bold md:font-black text-gray-800 mb-2">Which do you prefer?</h2>
      <p class="md:text-lg text-gray-600">Choose your preference to build the ranking</p>
    </div>

    <!-- VS Section with large, prominent buttons -->
    <div class="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
      <!-- Option A -->
      <button
        @click="(event) => { (event.target as HTMLElement).blur(); $emit('choose', game[0]) }"
        class="w-full lg:max-w-sm bg-gradient-to-br from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
        title="Choose Option A (1)"
      >
        <span class="text-sm font-medium text-indigo-200 mb-2 block">Option A</span>
        <span class="text-2xl lg:text-3xl leading-tight font-bold">{{ getLabel(game[0]) }}</span>
      </button>

      <!-- VS Divider -->
      <div class="flex items-center justify-center flex-col">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px" fill="currentColor" class="size-8">
          <path d="M737.54-150.15 615.15-273.31l-85 84-17.07-17.07q-16.39-16.39-16.39-39.47 0-23.07 16.39-39.46l164.61-164.61q16.39-16.39 39.46-16.39 23.08 0 39.47 16.39l17.07 17.07-84 85 123.16 121.39q8.69 8.69 8.69 20.11 0 11.43-8.69 20.12l-35.08 36.08q-8.69 8.69-20.12 8.69-11.42 0-20.11-8.69ZM824-737.92 410.31-323.46l36.61 37.38q16.39 16.39 16.39 39.46 0 23.08-16.39 39.47l-17.07 17.07-84-84-122.39 123.16q-8.69 8.69-20.11 8.69-11.43 0-20.12-8.69L148.15-186q-8.69-8.69-8.69-20.12 0-11.42 8.69-20.11l122.16-122.39-84-85 16.07-16.07q16.39-16.39 39.47-16.89 23.07-.5 39.46 15.89l40.15 39.38L736.92-827H824v89.08ZM354-567l21.23-22.77 21-21-21 21L354-567Zm-23.31 22.54L136-739.92V-827h89.08L418-633.31l-21.77 22.54L212-795h-44v42l186 186-23.31 22.54ZM387-346l405-405v-44h-42L345-388l42 42Zm0 0-20.23-21.77L345-388l21.77 20.23L387-346Z"/>
        </svg>
        <span class="uppercase text-sm font-medium">versus</span>
      </div>

      <!-- Option B -->
      <button
        @click="(event) => { (event.target as HTMLElement).blur(); $emit('choose', game[1]) }"
        class="w-full lg:max-w-sm bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
        title="Choose Option B (2)"
      >
        <span class="text-sm font-medium text-violet-200 mb-2 block">Option B</span>
        <span class="text-2xl lg:text-3xl leading-tight font-bold">{{ getLabel(game[1]) }}</span>
      </button>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-center items-center gap-3 flex-col">
      <button 
        @click="$emit('skip')" 
        class="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors font-medium cursor-pointer"
        title="Skip this comparison (S)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
          <path d="M2.53 3.956A1 1 0 0 0 1 4.804v6.392a1 1 0 0 0 1.53.848l5.113-3.196c.16-.1.279-.233.357-.383v2.73a1 1 0 0 0 1.53.849l5.113-3.196a1 1 0 0 0 0-1.696L9.53 3.956A1 1 0 0 0 8 4.804v2.731a.992.992 0 0 0-.357-.383L2.53 3.956Z" />
        </svg>
        <span class="font-medium">Skip this pair</span>
      </button>
      
      <button 
        v-if="canUndo"
        @click="$emit('undo')" 
        class="flex items-center space-x-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors font-medium cursor-pointer"
        title="Undo last comparison - Removes it from history (U)"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
          <path fill-rule="evenodd" d="M12.5 9.75A2.75 2.75 0 0 0 9.75 7H4.56l2.22 2.22a.75.75 0 1 1-1.06 1.06l-3.5-3.5a.75.75 0 0 1 0-1.06l3.5-3.5a.75.75 0 0 1 1.06 1.06L4.56 5.5h5.19a4.25 4.25 0 0 1 0 8.5h-1a.75.75 0 0 1 0-1.5h1a2.75 2.75 0 0 0 2.75-2.75Z" clip-rule="evenodd" />
        </svg>
        <span>Undo</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Props for the ComparisonChoice component
 */
interface Props {
  game: readonly [string, string]  // Pair of item IDs to compare
  getLabel: (id: string) => string  // Function to get display label for item ID
  canUndo: boolean  // Whether undo is available
}

/**
 * Events emitted by the ComparisonChoice component
 */
interface Emits {
  choose: [winner: string]  // When user chooses a winner
  skip: []  // When user skips the comparison
  undo: []  // When user undoes the last comparison
}

defineProps<Props>()
defineEmits<Emits>()
</script>