<!--
  ComparisonHistoryVisualization Component
  
  Interactive network visualization showing:
  - Items as nodes with size based on win count
  - Comparisons as edges with colors for win/loss
  - Hover effects for detailed information
  - Visual patterns in comparison decisions
-->
<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="font-semibold text-gray-800 flex items-center">
        <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
        Comparison Network
      </h3>
      
      <div v-if="games.length > 0" class="flex items-center space-x-4 text-sm">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-0.5 bg-green-500"></div>
          <span class="text-gray-600">Won</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-0.5 bg-red-500"></div>
          <span class="text-gray-600">Lost</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-0.5 bg-gray-400"></div>
          <span class="text-gray-600">Skipped</span>
        </div>
      </div>
    </div>

    <!-- Content: Either visualization or empty state -->
    <div v-if="games.length > 0">
      <!-- SVG Network Visualization -->
    <div class="relative bg-gray-50 rounded-lg p-4 overflow-hidden">
      <svg 
        viewBox="0 0 600 400"
        class="w-full h-auto border border-gray-200 rounded max-w-full"
        @mouseleave="clearHover"
      >
        <!-- Background Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f3f4f6" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Comparison Edges -->
        <g>
          <line
            v-for="edge in edges"
            :key="edge.id"
            :x1="edge.x1"
            :y1="edge.y1"
            :x2="edge.x2"
            :y2="edge.y2"
            :stroke="edge.color"
            :stroke-width="edge.width"
            stroke-opacity="0.7"
            class="transition-all duration-300"
            :class="{ 'stroke-opacity-100': hoveredItem && (edge.from === hoveredItem || edge.to === hoveredItem) }"
          />
        </g>

        <!-- Item Nodes -->
        <g>
          <g
            v-for="node in nodes"
            :key="node.id"
            class="cursor-pointer transition-all duration-300 hover:opacity-90"
            @mouseenter="hoverItem(node.id)"
            @click="selectItem(node.id)"
          >
            <!-- Node Circle -->
            <circle
              :cx="node.x"
              :cy="node.y"
              :r="node.radius"
              :fill="node.color"
              :stroke="node.strokeColor"
              :stroke-width="node.strokeWidth"
              class="transition-all duration-300"
              :class="{ 
                'drop-shadow-lg stroke-blue-500 stroke-2': hoveredItem === node.id,
                'stroke-blue-300 stroke-2': selectedItem === node.id
              }"
            />
            
            <!-- Node Label -->
            <text
              :x="node.x"
              :y="node.y + node.radius + 12"
              text-anchor="middle"
              class="text-xs font-medium fill-gray-700 transition-all duration-300 pointer-events-none"
              :class="{ 
                'font-bold fill-blue-600': hoveredItem === node.id,
                'fill-blue-700 font-semibold': selectedItem === node.id
              }"
            >
              {{ truncateLabel(getLabel(node.id), 10) }}
            </text>
            
            <!-- Win Count Badge -->
            <circle
              v-if="node.winCount > 0"
              :cx="node.x + node.radius - 5"
              :cy="node.y - node.radius + 5"
              r="8"
              fill="#10b981"
              class="drop-shadow-sm"
            />
            <text
              v-if="node.winCount > 0"
              :x="node.x + node.radius - 5"
              :y="node.y - node.radius + 9"
              text-anchor="middle"
              class="text-xs font-bold fill-white"
            >
              {{ node.winCount }}
            </text>
          </g>
        </g>

        <!-- Hover Tooltip -->
        <g v-if="hoveredItem && hoveredNode">
          <rect
            :x="hoveredNode.x - 60"
            :y="hoveredNode.y - hoveredNode.radius - 40"
            width="120"
            height="30"
            rx="4"
            fill="rgba(0, 0, 0, 0.8)"
            class="drop-shadow-lg"
          />
          <text
            :x="hoveredNode.x"
            :y="hoveredNode.y - hoveredNode.radius - 28"
            text-anchor="middle"
            class="text-xs font-medium fill-white"
          >
            {{ getLabel(hoveredItem) }}
          </text>
          <text
            :x="hoveredNode.x"
            :y="hoveredNode.y - hoveredNode.radius - 16"
            text-anchor="middle"
            class="text-xs fill-gray-300"
          >
            {{ hoveredNode.winCount }} wins • {{ hoveredNode.lossCount }} losses
          </text>
        </g>
      </svg>

      <!-- Legend and Stats -->
      <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div class="bg-white border border-gray-200 rounded p-3">
          <div class="font-semibold text-gray-700">Network Stats</div>
          <div class="text-gray-600">{{ nodes.length }} items • {{ edges.length }} comparisons</div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded p-3">
          <div class="font-semibold text-gray-700">Most Active</div>
          <div class="text-gray-600">{{ mostActiveItem?.label || 'None' }} ({{ mostActiveItem?.totalComparisons || 0 }})</div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded p-3">
          <div class="font-semibold text-gray-700">Network Density</div>
          <div class="text-gray-600">{{ networkDensity }}% connected</div>
        </div>
      </div>
    </div>

    <!-- Detailed Comparison Matrix -->
    <div v-if="selectedItem" class="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 class="font-semibold text-blue-800 mb-2">
        {{ getLabel(selectedItem) }} - Detailed Comparisons
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div>
          <div class="font-medium text-green-700">Victories ({{ getItemWins(selectedItem).length }})</div>
          <div class="space-y-1">
            <div 
              v-for="win in getItemWins(selectedItem)" 
              :key="win.id"
              class="text-green-600"
            >
              ✓ Beat {{ getLabel(win.opponent) }}
            </div>
          </div>
        </div>
        
        <div>
          <div class="font-medium text-red-700">Defeats ({{ getItemLosses(selectedItem).length }})</div>
          <div class="space-y-1">
            <div 
              v-for="loss in getItemLosses(selectedItem)" 
              :key="loss.id"
              class="text-red-600"
            >
              ✗ Lost to {{ getLabel(loss.opponent) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- Interaction hint - shows when there are nodes to click -->
    <div v-if="games.length > 0" class="text-center mt-3 text-xs text-gray-500">
      <p>💡 Click on any node to see detailed comparison breakdown</p>
    </div>

    <!-- Empty State when no games yet -->
    <div v-else class="relative bg-gray-50 rounded-lg p-8 text-center">
      <div class="space-y-4">
        <div class="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-gray-700 mb-2">No comparisons yet</h4>
          <p class="text-gray-500 text-sm">
            The comparison network will appear here as you make choices between items.
            <br>
            Each item will be a node, and your comparisons will be connections between them.
          </p>
        </div>
        <div class="text-xs text-gray-400 border-t border-gray-200 pt-4 space-y-2">
          <p>💡 Start comparing items to see this visualization come to life!</p>
          <p class="flex items-center justify-center space-x-1 text-purple-500">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>Click on nodes for detailed comparison breakdown</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Game } from '../types'

/**
 * Props for the ComparisonHistoryVisualization component
 */
interface Props {
  games: Game[]  // Array of completed games
  items: Array<{ id: string; label: string }>  // Array of items
  getLabel: (id: string) => string  // Function to get item labels
}

const props = defineProps<Props>()

// Component state
const hoveredItem = ref<string | null>(null)
const selectedItem = ref<string | null>(null)
const svgWidth = 600
const svgHeight = 400

/**
 * Calculate win/loss counts for each item
 */
const itemStats = computed(() => {
  const stats: Record<string, { wins: number; losses: number; comparisons: number }> = {}
  
  // Initialize stats for all items
  props.items.forEach(item => {
    stats[item.id] = { wins: 0, losses: 0, comparisons: 0 }
  })
  
  // Count wins and losses
  props.games.forEach(game => {
    if (game.winner && !game.skipped) {
      const loser = game.itemA === game.winner ? game.itemB : game.itemA
      stats[game.winner].wins++
      stats[loser].losses++
      stats[game.winner].comparisons++
      stats[loser].comparisons++
    } else if (game.skipped) {
      stats[game.itemA].comparisons++
      stats[game.itemB].comparisons++
    }
  })
  
  return stats
})

/**
 * Generate node positions in a circular layout
 */
const nodes = computed(() => {
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2
  const radius = Math.min(svgWidth, svgHeight) / 3
  
  return props.items.map((item, index) => {
    const angle = (2 * Math.PI * index) / props.items.length
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    
    const stats = itemStats.value[item.id] || { wins: 0, losses: 0, comparisons: 0 }
    const nodeRadius = Math.max(15, 8 + stats.wins * 2)
    
    return {
      id: item.id,
      x,
      y,
      radius: nodeRadius,
      winCount: stats.wins,
      lossCount: stats.losses,
      color: getNodeColor(stats.wins, stats.losses),
      strokeColor: hoveredItem.value === item.id ? '#3b82f6' : '#6b7280',
      strokeWidth: hoveredItem.value === item.id ? 3 : 2
    }
  })
})

/**
 * Generate edges for comparisons
 */
const edges = computed(() => {
  const nodeMap = new Map(nodes.value.map(node => [node.id, node]))
  
  return props.games
    .filter(game => game.winner || game.skipped)
    .map(game => {
      const fromNode = nodeMap.get(game.itemA)
      const toNode = nodeMap.get(game.itemB)
      
      if (!fromNode || !toNode) return null
      
      let color = '#9ca3af' // gray for skipped
      let width = 2
      
      if (game.winner && !game.skipped) {
        if (game.winner === game.itemA) {
          color = '#10b981' // green - A won
        } else {
          color = '#ef4444' // red - A lost
        }
        width = 3
      }
      
      return {
        id: game.id,
        from: game.itemA,
        to: game.itemB,
        x1: fromNode.x,
        y1: fromNode.y,
        x2: toNode.x,
        y2: toNode.y,
        color,
        width
      }
    })
    .filter(Boolean) as Array<{
      id: string
      from: string
      to: string
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
      width: number
    }>
})

/**
 * Find the currently hovered node
 */
const hoveredNode = computed(() => {
  return hoveredItem.value ? nodes.value.find(node => node.id === hoveredItem.value) : null
})

/**
 * Most active item (most comparisons)
 */
const mostActiveItem = computed(() => {
  let maxComparisons = 0
  let mostActive = null
  
  for (const item of props.items) {
    const stats = itemStats.value[item.id]
    if (stats && stats.comparisons > maxComparisons) {
      maxComparisons = stats.comparisons
      mostActive = { label: item.label, totalComparisons: stats.comparisons }
    }
  }
  
  return mostActive
})

/**
 * Calculate network density (percentage of possible connections made)
 */
const networkDensity = computed(() => {
  const totalPossible = (props.items.length * (props.items.length - 1)) / 2
  const totalMade = props.games.length
  return totalPossible > 0 ? Math.round((totalMade / totalPossible) * 100) : 0
})

/**
 * Get node color based on win/loss ratio
 */
const getNodeColor = (wins: number, losses: number): string => {
  const total = wins + losses
  if (total === 0) return '#e5e7eb' // gray
  
  const winRate = wins / total
  if (winRate >= 0.7) return '#10b981' // green
  if (winRate >= 0.5) return '#3b82f6' // blue
  if (winRate >= 0.3) return '#f59e0b' // amber
  return '#ef4444' // red
}

/**
 * Truncate label for display
 */
const truncateLabel = (label: string, maxLength: number): string => {
  return label.length > maxLength ? label.substring(0, maxLength) + '...' : label
}

/**
 * Get wins for a specific item
 */
const getItemWins = (itemId: string) => {
  return props.games
    .filter(game => game.winner === itemId && !game.skipped)
    .map(game => ({
      id: game.id,
      opponent: game.itemA === itemId ? game.itemB : game.itemA
    }))
}

/**
 * Get losses for a specific item
 */
const getItemLosses = (itemId: string) => {
  return props.games
    .filter(game => game.winner && game.winner !== itemId && !game.skipped && (game.itemA === itemId || game.itemB === itemId))
    .map(game => ({
      id: game.id,
      opponent: game.winner!
    }))
}

/**
 * Handle item hover
 */
const hoverItem = (itemId: string) => {
  hoveredItem.value = itemId
}

/**
 * Clear hover state
 */
const clearHover = () => {
  hoveredItem.value = null
}

/**
 * Handle item selection
 */
const selectItem = (itemId: string) => {
  selectedItem.value = selectedItem.value === itemId ? null : itemId
}
</script>

<style scoped>
.drop-shadow-lg {
  filter: drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1));
}

.drop-shadow-sm {
  filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1)) drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));
}
</style>