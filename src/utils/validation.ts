/**
 * Validation utilities for form inputs and data integrity
 */

import type { List, Item } from '../types'
import { VALIDATION_MESSAGES } from '../constants'

/**
 * Validates a new item name against existing items
 * @param label - The item name to validate
 * @param existingItems - Array of existing items to check against
 * @returns Validation result with error message if invalid
 */
export function validateItemName(label: string, existingItems: Item[]): { isValid: boolean; error?: string } {
  const trimmedLabel = label.trim()
  
  if (!trimmedLabel) {
    return { isValid: false, error: VALIDATION_MESSAGES.EMPTY_ITEM }
  }
  
  const isDuplicate = existingItems.some(item => 
    item.label.toLowerCase() === trimmedLabel.toLowerCase()
  )
  
  if (isDuplicate) {
    return { isValid: false, error: VALIDATION_MESSAGES.DUPLICATE_ITEM }
  }
  
  return { isValid: true }
}

/**
 * Validates a new list name against existing lists
 * @param name - The list name to validate
 * @param existingLists - Array of existing lists to check against
 * @returns Validation result with error message if invalid
 */
export function validateListName(name: string, existingLists: List[]): { isValid: boolean; error?: string } {
  const trimmedName = name.trim()
  
  if (!trimmedName) {
    return { isValid: false, error: VALIDATION_MESSAGES.EMPTY_LIST }
  }
  
  const isDuplicate = existingLists.some(list => 
    list.name.toLowerCase() === trimmedName.toLowerCase()
  )
  
  if (isDuplicate) {
    return { isValid: false, error: VALIDATION_MESSAGES.DUPLICATE_LIST }
  }
  
  return { isValid: true }
}

/**
 * Validates that a list has enough items for comparison
 * @param items - Array of items to validate
 * @returns True if list has at least 2 items
 */
export function validateListForComparison(items: Item[]): boolean {
  return items.length >= 2
}