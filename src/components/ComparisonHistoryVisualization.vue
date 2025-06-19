<!--
  ComparisonHistoryVisualization Component
  
  Interactive network visualization showing:
  - Items as nodes with size based on win count
  - Comparisons as edges with colors for win/loss
  - Hover effects for detailed information
  - Visual patterns in comparison decisions
-->
<template>
  <div class="p-6 bg-white border border-gray-200 rounded-xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-800 flex items-center space-x-2">
        Comparison Network
      </h2>
      
      <div v-if="games.length > 0" class="flex items-center space-x-4 text-sm md:text-base">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-0.5 bg-green-500"></div>
          <span class="text-gray-600">Won</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="w-3 h-0.5 bg-red-500"></div>
          <span class="text-gray-600">Lost</span>
        </div>
        <div class="flex items-center space-x-2">
          <svg width="12" height="2" class="flex-shrink-0">
            <line x1="0" y1="1" x2="12" y2="1" stroke="#9ca3af" stroke-width="2" stroke-dasharray="2 1" />
          </svg>
          <span class="text-gray-600">Skipped</span>
        </div>
      </div>
    </div>

    <!-- Content: Either visualization or empty state -->
    <div v-if="games.length > 0">
      <!-- SVG Network Visualization -->
    <div class="relative bg-gray-50 rounded-xl p-6 overflow-hidden">
      <svg 
        viewBox="0 0 600 400"
        class="w-full h-auto border border-gray-300 rounded max-w-full"
        @mouseleave="clearHover"
      >
        <!-- Background Grid -->
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e8e8e8" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- Comparison Edges with Gradient Lines and Subtle Arrows -->
        <defs>
          <!-- Subtle chevron-style arrow markers -->
          <marker
            id="chevron-arrow-red"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M1,1 L3,3 L1,5"
              stroke="#dc2626"
              stroke-width="1"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </marker>
          
          <marker
            id="chevron-arrow-green"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M1,1 L3,3 L1,5"
              stroke="#16a34a"
              stroke-width="1"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </marker>
          
          <!-- Gradient definitions for winner->loser lines -->
          <linearGradient
            v-for="game in props.games.filter(g => g.winner && !g.skipped)"
            :key="'grad-' + game.id"
            :id="'gradient-' + game.id.replace(/[^a-zA-Z0-9]/g, '-')"
            gradientUnits="userSpaceOnUse"
            :x1="getWinnerNode(game)?.x || 0"
            :y1="getWinnerNode(game)?.y || 0"
            :x2="getLoserNode(game)?.x || 0"
            :y2="getLoserNode(game)?.y || 0"
          >
            <stop offset="0%" stop-color="#16a34a" /> <!-- Green at winner -->
            <stop offset="100%" stop-color="#dc2626" /> <!-- Red at loser -->
          </linearGradient>
        </defs>
        
        <g>
          <!-- Lines with gradients and subtle arrows -->
          <line
            v-for="edge in edges"
            :key="edge.id"
            :x1="edge.x1"
            :y1="edge.y1"
            :x2="edge.x2"
            :y2="edge.y2"
            :stroke="edge.isSkipped ? edge.color : (edge.color ? edge.color : `url(#gradient-${edge.id})`)"
            :stroke-width="edge.width"
            :stroke-dasharray="edge.isSkipped ? '4 3' : 'none'"
            :marker-end="edge.isSkipped ? '' : (edge.arrowType === 'green' ? 'url(#chevron-arrow-green)' : 'url(#chevron-arrow-red)')"
            class="transition-all duration-300"
          />
        </g>

        <!-- Item Nodes -->
        <g>
          <g
            v-for="node in nodes"
            :key="node.id"
            class="cursor-pointer transition-all duration-300"
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
                'drop-shadow-lg stroke-gray-900 stroke-2': hoveredItem === node.id,
                'stroke-gray-900 stroke-2 drop-shadow-lg': selectedItem === node.id
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
              fill="currentColor"
              class="drop-shadow-sm text-green-700"
            />
            <text
              v-if="node.winCount > 0"
              :x="node.x + node.radius - 4.9"
              :y="node.y - node.radius + 8.2"
              text-anchor="middle"
              class="text-[9px] font-light fill-white"
            >
              {{ node.winCount }}
            </text>
          </g>
        </g>

        <!-- Hover Tooltip -->
        <g v-if="hoveredItem && hoveredNode && tooltipInfo">
          <rect
            :x="tooltipInfo.x"
            :y="tooltipInfo.y"
            :width="tooltipInfo.width"
            :height="tooltipInfo.height"
            rx="4"
            fill="rgba(0, 0, 0, 0.8)"
            class="drop-shadow-lg"
          />
          <!-- Multi-line item label -->
          <text
            v-for="(line, index) in tooltipInfo.labelLines"
            :key="index"
            :x="tooltipInfo.centerX"
            :y="tooltipInfo.y + 12 + 10 + (index * 12)"
            text-anchor="middle"
            class="text-xs font-medium fill-white"
          >
            {{ line }}
          </text>
          <!-- Stats line -->
          <text
            :x="tooltipInfo.centerX"
            :y="tooltipInfo.y + 12 + 10 + (tooltipInfo.labelLines.length * 12) + 8"
            text-anchor="middle"
            class="text-xs fill-gray-300"
          >
            {{ hoveredNode.winCount }} wins • {{ hoveredNode.lossCount }} losses
          </text>
        </g>
      </svg>

      <!-- Legend and Stats -->
      <div class="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
        <div class="bg-white border border-gray-200 rounded p-3">
          <div class="font-semibold text-gray-700">Network Stats</div>
          <div class="text-gray-600">{{ nodes.length }} items • {{ completedComparisons }} comparisons</div>
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
    <div v-if="selectedItem" class="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-6">
      <h4 class="font-semibold text-gray-800 mb-2">
         Detailed Comparisons for {{ getLabel(selectedItem) }}
      </h4>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
        <div>
          <div class="font-medium text-green-700 mb-2">Victories ({{ getItemWins(selectedItem).length }})</div>
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
          <div class="font-medium text-red-700 mb-2">Defeats ({{ getItemLosses(selectedItem).length }})</div>
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
    <div v-if="games.length > 0" class="text-center mt-8 mb-2 text-xs text-gray-500">
      <p>Click on any node to see detailed comparison breakdown.</p>
    </div>

    <!-- Empty State when no games yet -->
    <div v-else class="bg-gradient-to-t from-emerald-50 to-gray-50 border border-green-800/20 inset-ring inset-ring-white rounded-lg p-12 text-center">
      <div class="space-y-4">
        <div class="w-14 h-14 mx-auto bg-gradient-to-br from-emerald-100 to-green-300 ring-1 ring-emerald-300 inset-ring inset-ring-white rounded-lg flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-7 text-emerald-800">
            <path fill-rule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clip-rule="evenodd" />
          </svg>
        </div>
        <div>
          <h4 class="font-semibold text-emerald-800 mb-2 text-lg">No Comparisons Yet</h4>
          <p class="text-emerald-600 max-w-md mx-auto">
            The comparison network will appear here as you make choices between items. Each item will be a node, and your comparisons will be connections between them.
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { getCompletedComparisons } from '../utils/comparison'
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

// Constants
const svgWidth = 600
const svgHeight = 400
const minNodeRadius = 15
const nodeRadiusPerWin = 2
const tooltipMargin = 10

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
    const nodeRadius = Math.max(minNodeRadius, 8 + stats.wins * nodeRadiusPerWin)
    
    return {
      id: item.id,
      x,
      y,
      radius: nodeRadius,
      winCount: stats.wins,
      lossCount: stats.losses,
      color: getNodeColor(stats.wins, stats.losses),
      strokeColor: hoveredItem.value === item.id ? '#3b82f6' : 'transparent',
      strokeWidth: hoveredItem.value === item.id ? 3 : 2
    }
  })
})

/**
 * Generate edges for comparisons with directional arrows
 */
const edges = computed(() => {
  const nodeMap = new Map(nodes.value.map(node => [node.id, node]))
  
  
  const result = props.games
    .filter(game => game.winner || game.skipped)
    .map(game => {
      const nodeA = nodeMap.get(game.itemA)
      const nodeB = nodeMap.get(game.itemB)
      
      if (!nodeA || !nodeB) {
        return null
      }
      
      // Determine winner and loser nodes for arrow direction
      let winnerNode, loserNode, isSkipped = false
      
      if (game.skipped || !game.winner) {
        // For skipped games, no directional preference
        winnerNode = nodeA
        loserNode = nodeB
        isSkipped = true
      } else {
        // Arrow points from winner to loser
        if (game.winner === game.itemA) {
          winnerNode = nodeA
          loserNode = nodeB
        } else {
          winnerNode = nodeB
          loserNode = nodeA
        }
      }
      
      // Calculate arrow positioning (shorter line to accommodate arrowhead)
      const dx = loserNode.x - winnerNode.x
      const dy = loserNode.y - winnerNode.y
      const length = Math.sqrt(dx * dx + dy * dy)
      const unitX = dx / length
      const unitY = dy / length
      
      // Different line lengths for arrows vs no arrows
      const startX = winnerNode.x + unitX * (winnerNode.radius + 2)
      const startY = winnerNode.y + unitY * (winnerNode.radius + 2)
      
      let endX, endY
      if (isSkipped) {
        // Skipped lines go full distance (no arrow to accommodate)
        endX = loserNode.x - unitX * (loserNode.radius + 2)
        endY = loserNode.y - unitY * (loserNode.radius + 2)
      } else {
        // Winner lines end before node edge (arrow fills the gap)
        endX = loserNode.x - unitX * (loserNode.radius + 5)
        endY = loserNode.y - unitY * (loserNode.radius + 5)
      }
      
      // Simplified line weight and visibility system
      let color, width = 1 // Default: small weight
      let isVisible = true
      let arrowType = 'red' // Default arrow type
      
      if (selectedItem.value || hoveredItem.value) {
        const focusedNode = selectedItem.value || hoveredItem.value
        
        if (game.itemA === focusedNode || game.itemB === focusedNode) {
          // Line connected to focused node: medium weight, appropriate color
          width = 2
          if (isSkipped) {
            color = '#6b7280' // gray for skipped
            arrowType = 'none'
          } else if (focusedNode === game.winner) {
            color = '#16a34a' // green - focused node won
            arrowType = 'green'
          } else {
            color = '#dc2626' // red - focused node lost
            arrowType = 'red'
          }
        } else {
          // Line not connected to focused node: hide it
          isVisible = false
        }
      } else {
        // Default state: small weight, use gradient (no single color)
        if (isSkipped) {
          color = '#6b7280' // gray
          arrowType = 'none'
        } else {
          color = null // Will use gradient
          arrowType = 'red' // Arrow points to loser (red end of gradient)
        }
      }
      
      return {
        id: game.id.replace(/[^a-zA-Z0-9]/g, '-'),
        from: game.itemA,
        to: game.itemB,
        winner: game.winner,
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        color,
        width,
        isSkipped,
        isVisible,
        arrowType
      }
    })
    .filter(edge => edge && edge.isVisible)
  
  return result as Array<{
      id: string
      from: string
      to: string
      winner?: string
      x1: number
      y1: number
      x2: number
      y2: number
      color: string
      width: number
      isSkipped: boolean
      isVisible: boolean
      arrowType: string
    }>
})

/**
 * Find the currently hovered node
 */
const hoveredNode = computed(() => {
  return hoveredItem.value ? nodes.value.find(node => node.id === hoveredItem.value) : null
})

/**
 * Count of completed comparisons (excluding skipped games)
 */
const completedComparisons = computed(() => {
  return getCompletedComparisons({ games: props.games })
})

/**
 * Break text into lines that fit within max width
 */
const wrapText = (text: string, maxCharsPerLine: number): string[] => {
  if (text.length <= maxCharsPerLine) return [text]
  
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine
    } else {
      if (currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        // Single word is too long, truncate it
        lines.push(word.substring(0, maxCharsPerLine - 3) + '...')
        currentLine = ''
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }
  
  // Limit to 3 lines max
  if (lines.length > 3) {
    lines[2] = lines[2].substring(0, maxCharsPerLine - 3) + '...'
    return lines.slice(0, 3)
  }
  
  return lines
}

/**
 * Calculate tooltip dimensions and position
 */
const tooltipInfo = computed(() => {
  if (!hoveredItem.value || !hoveredNode.value) return null
  
  const itemLabel = props.getLabel(hoveredItem.value)
  const stats = `${hoveredNode.value.winCount} wins • ${hoveredNode.value.lossCount} losses`
  
  // Set max tooltip width (80% of SVG width)
  const maxTooltipWidth = Math.min(300, svgWidth * 0.8)
  const maxCharsPerLine = Math.floor(maxTooltipWidth / 7) // ~7px per char
  
  // Wrap the item label into multiple lines if needed
  const labelLines = wrapText(itemLabel, maxCharsPerLine)
  
  // Calculate actual tooltip dimensions
  const longestLineLength = Math.max(
    ...labelLines.map(line => line.length),
    stats.length
  )
  
  const tooltipWidth = Math.max(120, Math.min(maxTooltipWidth, longestLineLength * 7 + 40))
  // Calculate content height: label lines + gap + stats line
  const contentHeight = (labelLines.length * 12) + 8 + 12
  const tooltipHeight = contentHeight + 24 // content + equal padding top/bottom (12px each)
  
  // Calculate position with smart edge detection
  const nodeX = hoveredNode.value.x
  const nodeY = hoveredNode.value.y - hoveredNode.value.radius - tooltipHeight - 5
  
  // Default: center tooltip above node
  let tooltipX = nodeX - (tooltipWidth / 2)
  
  // Adjust if tooltip would overflow SVG boundaries
  if (tooltipX < tooltipMargin) {
    tooltipX = tooltipMargin
  } else if (tooltipX + tooltipWidth > svgWidth - tooltipMargin) {
    tooltipX = svgWidth - tooltipWidth - tooltipMargin
  }
  
  // Adjust Y position if too close to top
  let tooltipY = nodeY
  if (tooltipY < tooltipMargin) {
    tooltipY = hoveredNode.value.y + hoveredNode.value.radius + 15
  }
  
  return {
    x: tooltipX,
    y: tooltipY,
    width: tooltipWidth,
    height: tooltipHeight,
    centerX: tooltipX + (tooltipWidth / 2),
    labelLines
  }
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
  if (winRate >= 0.7) return 'oklch(72.3% 0.219 149.579)' // green
  if (winRate >= 0.5) return 'oklch(51.1% 0.262 276.966)' // blue
  if (winRate >= 0.3) return 'oklch(51.1% 0.262 276.966)' // amber
  return 'oklch(63.7% 0.237 25.331)' // red
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

/**
 * Get winner node for a game
 */
const getWinnerNode = (game: any) => {
  return nodes.value.find(node => node.id === game.winner)
}

/**
 * Get loser node for a game
 */
const getLoserNode = (game: any) => {
  const loserId = game.itemA === game.winner ? game.itemB : game.itemA
  return nodes.value.find(node => node.id === loserId)
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