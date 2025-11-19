import { ref } from 'vue'

// Стан винесено назовні, щоб бути глобальним (Singleton)
const show = ref(false)
const message = ref('')
const type = ref<'success' | 'error'>('success')

export function useToast() {
  function triggerToast(msg: string, toastType: 'success' | 'error' = 'success') {
    message.value = msg
    type.value = toastType
    show.value = true

    // Автоматично ховаємо через 3 секунди
    setTimeout(() => {
      show.value = false
    }, 3000)
  }

  return {
    show,
    message,
    type,
    triggerToast
  }
}
