# 🏆 Duel Rank

A modern, intuitive ranking application that uses pairwise comparisons to help you rank anything—from your favorite movies to project priorities. Built with Vue 3, TypeScript, and Tailwind CSS.

## 🎮 How to Use

### Creating Your First List
1. Click "Create New List" and give it a name
2. Add at least 2 items you want to rank
3. Navigate to the comparison view to start ranking

### Making Comparisons
- **Choose**: Click on the item you prefer between the two options
- **Skip**: If you can't decide or want to compare later
- **Keyboard Shortcuts**: 
  - `A` or `1` - Choose left option
  - `B` or `2` - Choose right option  
  - `S` or `Space` - Skip comparison
  - `U` - Undo last comparison

### Understanding the Results
- **Rankings**: Items are ordered from best to worst based on your comparisons
- **Confidence**: Percentage indicating how certain the algorithm is about each position
- **Direct vs Inferred**: Green checkmarks show directly compared positions, yellow wavy lines show inferred positions

### Refining Your Rankings
- Once initial ranking is complete, use "Continue refining" to make additional direct comparisons
- This improves accuracy by reducing inferred positions

## 🛠️ Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Storage**: VueUse (localStorage)
- **Build Tool**: Vite
- **Icons**: Heroicons


## 🧮 Algorithm Details

The ranking system uses several algorithms to provide accurate rankings with minimal comparisons:

1. **Transitive Closure**: If A > B and B > C, then A > C (inferred relationship)
2. **Topological Sorting**: Orders items based on comparison results
3. **Confidence Calculation**: Measures certainty based on direct vs inferred relationships
4. **Smart Pair Selection**: Prioritizes comparisons that resolve the most uncertainty