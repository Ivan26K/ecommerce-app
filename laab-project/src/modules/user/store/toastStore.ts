import { defineStore } from 'pinia'
import { ref } from 'vue'

// ОНОВЛЕННЯ: Додано властивість 'to'
export interface ToastState {
  message: string
  type: 'success' | 'error' | 'info'
  timeout: number
  to?: string // Необов'язковий шлях для переходу (наприклад, '/cart')
}

// Затримка, після якої повідомлення автоматично зникне
const DEFAULT_TIMEOUT = 3000

export const useToastStore = defineStore('toast', () => {
  const isVisible = ref(false)
  const toast = ref<ToastState>({
    message: '',
    type: 'info',
    timeout: DEFAULT_TIMEOUT,
    to: undefined,
  })
  let timer: number | null = null

  function showToast(newState: Partial<ToastState>) {
    // Очищаємо попередній таймер
    if (timer !== null) {
      clearTimeout(timer)
    }

    // Встановлюємо новий стан
    toast.value = {
      message: newState.message || '',
      type: newState.type || 'info',
      timeout: newState.timeout || DEFAULT_TIMEOUT,
      to: newState.to, // Встановлюємо шлях
    }
    isVisible.value = true

    // Встановлюємо таймер на зникнення
    timer = setTimeout(() => {
      hideToast()
    }, toast.value.timeout) as any
  }

  function hideToast() {
    isVisible.value = false
    if (timer !== null) {
      clearTimeout(timer)
      timer = null
    }
  }

  return {
    toast,
    isVisible,
    showToast,
    hideToast,
  }
})
