/**
 * Composable for handling form validation state and logic
 */

import { ref, readonly } from 'vue'

/**
 * Creates a reactive form validation composable
 * @param validator - Function that validates the input value
 * @returns Object with validation state and methods
 */
export function useFormValidation<T>(
  validator: (value: T, ...args: any[]) => { isValid: boolean; error?: string }
) {
  const error = ref<string>('')
  const isValid = ref<boolean>(true)

  /**
   * Validates a value and updates the validation state
   * @param value - Value to validate
   * @param args - Additional arguments to pass to the validator
   * @returns True if validation passes
   */
  const validate = (value: T, ...args: any[]): boolean => {
    const result = validator(value, ...args)
    
    isValid.value = result.isValid
    error.value = result.error || ''
    
    return result.isValid
  }

  /**
   * Clears the current validation error
   */
  const clearError = () => {
    error.value = ''
    isValid.value = true
  }

  return {
    error: readonly(error),
    isValid: readonly(isValid),
    validate,
    clearError
  }
}

/**
 * Creates a simple reactive input composable with validation
 * @param initialValue - Initial value for the input
 * @param validator - Optional validator function
 * @returns Input state and validation methods
 */
export function useValidatedInput<T>(
  initialValue: T,
  validator?: (value: any, ...args: any[]) => { isValid: boolean; error?: string }
) {
  const value = ref<T>(initialValue)
  const validation = validator ? useFormValidation(validator) : null

  /**
   * Updates the input value and optionally validates it
   * @param newValue - New value to set
   * @param validationArgs - Arguments to pass to validator
   */
  const setValue = (newValue: T, ...validationArgs: any[]) => {
    value.value = newValue
    if (validation) {
      validation.validate(newValue, ...validationArgs)
    }
  }

  /**
   * Validates the current value
   * @param currentValue - Value to validate
   * @param validationArgs - Arguments to pass to validator
   */
  const validate = (currentValue: any, ...validationArgs: any[]): boolean => {
    if (validation) {
      return validation.validate(currentValue, ...validationArgs)
    }
    return true
  }

  /**
   * Resets the input to its initial value and clears errors
   */
  const reset = () => {
    value.value = initialValue
    validation?.clearError()
  }

  return {
    value,
    setValue,
    validate,
    reset,
    error: validation?.error,
    isValid: validation?.isValid,
    clearError: validation?.clearError
  }
}