import { ref } from 'vue'

interface ConfirmationOptions {
  type?: 'delete' | 'reset' | 'warning'
  title: string
  subtitle?: string
  message: string
  confirmText?: string
  cancelText?: string
}

interface ConfirmationState extends ConfirmationOptions {
  isOpen: boolean
}

const confirmationState = ref<ConfirmationState>({
  isOpen: false,
  type: 'warning',
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel'
})

let resolveCallback: ((value: boolean) => void) | null = null

export function useConfirmation() {
  const showConfirmation = (options: ConfirmationOptions): Promise<boolean> => {
    confirmationState.value = {
      ...options,
      isOpen: true
    }

    return new Promise<boolean>((resolve) => {
      resolveCallback = resolve
    })
  }

  const handleConfirm = () => {
    confirmationState.value.isOpen = false
    if (resolveCallback) {
      resolveCallback(true)
      resolveCallback = null
    }
  }

  const handleCancel = () => {
    confirmationState.value.isOpen = false
    if (resolveCallback) {
      resolveCallback(false)
      resolveCallback = null
    }
  }

  return {
    confirmationState,
    showConfirmation,
    handleConfirm,
    handleCancel
  }
}