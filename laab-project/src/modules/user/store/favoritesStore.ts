import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Product } from '@/types/types'
import { useToastStore } from '@/modules/user/store/toastStore'
import { useAuthStore } from '@/modules/user/store/authStore'

export const useFavoritesStore = defineStore('favorites', () => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  const savedFavorites = localStorage.getItem('favorites')
  const favorites = ref<Product[]>(savedFavorites ? JSON.parse(savedFavorites) : [])

  function isFavorite(productId: number) {
    return favorites.value.some(item => item.id === productId)
  }

  // Action: Додати/Видалити (Toggle)
  function toggleFavorite(product: Product): boolean {
    if (!authStore.isAuthenticated) {
      // Повідомлення про необхідність авторизації (не клікабельне)
      toastStore.showToast({
        message: 'Please log in to add products to your favorites.',
        type: 'error',
        timeout: 4000
      })
      return false
    }

    const index = favorites.value.findIndex(item => item.id === product.id)

    if (index === -1) {
      favorites.value.push(product)
      // ОНОВЛЕНО: Інтерактивний Toast для Favorites
      toastStore.showToast({
        message: `${product.title} added to Favorites! Click to view.`,
        type: 'success',
        timeout: 3000,
        to: '/favorites'
      })
      return true
    } else {
      favorites.value.splice(index, 1)
      toastStore.showToast({
        message: `${product.title} removed from Favorites.`,
        type: 'info',
        timeout: 3000
      })
      return false
    }
  }

  // Зберігаємо в localStorage
  watch(favorites, (newVal) => {
    localStorage.setItem('favorites', JSON.stringify(newVal))
  }, { deep: true })

  return {
    favorites,
    toggleFavorite,
    isFavorite
  }
})
