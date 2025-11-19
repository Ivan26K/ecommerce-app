import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import type { Product } from '@/types/types'
import { useToastStore } from '@/modules/user/store/toastStore'

export const useCartStore = defineStore('cart', () => {
  const toastStore = useToastStore()

  const loadCartFromStorage = (): Product[] => {
    try {
      const savedCart = localStorage.getItem('cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch (e) {
      console.error("Could not load cart from storage", e)
      return []
    }
  }

  // --- State ---
  const cartItems = ref<Product[]>(loadCartFromStorage())

  // --- Getters ---
  const totalPrice = computed(() => {
    // ВИПРАВЛЕНО: Додано .value
    return cartItems.value.reduce((sum, item) => sum + item.price, 0)
  })

  // ВИПРАВЛЕНО: Додано .value
  const totalItems = computed(() => cartItems.value.length)

  // --- Actions ---

  function addToCart(product: Product) {
    // ВИПРАВЛЕНО: Додано .value
    cartItems.value.push(product)

    toastStore.showToast({
      message: `${product.title} added to cart! Click to view.`,
      type: 'success',
      timeout: 4000,
      to: '/cart'
    })
  }

  function removeFromCart(productId: number) {
    // ВИПРАВЛЕНО: Використовуємо .value для пошуку та зміни масиву
    const index = cartItems.value.findIndex(item => item.id === productId)
    if (index !== -1) {
      cartItems.value.splice(index, 1) // ВИПРАВЛЕНО: .value
    }
  }

  function clearCart() {
    cartItems.value = [] // ВИПРАВЛЕНО: .value
  }

  function checkout() {
    clearCart()

    toastStore.showToast({
      message: 'Order placed successfully! The manager will contact you soon.',
      type: 'success',
      timeout: 4000,
    })
  }

  // --- Watch: Збереження в localStorage ---
  watch(cartItems, (newVal) => {
    localStorage.setItem('cart', JSON.stringify(newVal))
  }, { deep: true })

  return {
    cartItems,
    totalPrice,
    totalItems,
    addToCart,
    removeFromCart,
    clearCart,
    checkout,
  }
})
