<script setup lang="ts">
import { useCartStore } from '@/modules/user/store/cartStore'
import { useAuthStore } from '@/modules/user/store/authStore'
import { useToastStore } from '@/modules/user/store/toastStore'
import { storeToRefs } from 'pinia'
import { useRouter, RouterLink } from 'vue-router'

const cartStore = useCartStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const { cartItems, totalItems, totalPrice } = storeToRefs(cartStore)
const { isAuthenticated } = storeToRefs(authStore)
const { removeFromCart } = cartStore
const router = useRouter()

const handleCheckout = () => {
  // 1. Перевірка авторизації
  if (!isAuthenticated.value) {
    toastStore.showToast({
      message: 'Authorization required to proceed to checkout!',
      type: 'error',
      timeout: 4000
    })
    return
  }

  // 2. Якщо авторизований - продовжуємо
  cartStore.checkout()

  // Затримка навігації, щоб користувач побачив Toast
  setTimeout(() => {
    router.push('/products')
  }, 4500)
}

const continueShopping = () => {
  router.push('/products')
}
</script>

<template>
  <div class="container cart-page">
    <h1 class="page-title">Your Shopping Cart ({{ totalItems }})</h1>

    <div v-if="totalItems === 0" class="empty-state-enhanced">
      <span class="bag-icon">🛒</span>
      <h2>Your Cart is Empty!</h2>
      <p>Fill it up with great products and proceed to checkout.</p>
      <button @click="continueShopping" class="explore-btn">
        Start Shopping Now
      </button>
    </div>

    <div v-else class="cart-layout">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.images[0]?.startsWith('http') ? item.images[0] : 'https://i.imgur.com/Gj0K5dJ.jpeg'" :alt="item.title" class="item-image" />

          <div class="item-details">
            <h3>{{ item.title }}</h3>
            <p class="price">${{ item.price }}</p>
          </div>

          <button @click="removeFromCart(item.id)" class="remove-btn">
            Remove
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-details">
          <p>Subtotal ({{ totalItems }} items):</p>
          <p class="price">${{ totalPrice.toFixed(2) }}</p>
        </div>
        <div class="summary-details total">
          <p>Total:</p>
          <p class="price">${{ totalPrice.toFixed(2) }}</p>
        </div>

        <button
          @click="handleCheckout"
          class="checkout-btn"
        >
          Proceed to Checkout
        </button>

        <button @click="cartStore.clearCart()" class="clear-btn">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container { max-width: 1000px; margin: 0 auto; padding: 20px; }
.cart-page { min-height: 60vh; }
.page-title { text-align: center; margin-bottom: 2rem; }

/* ✅ СТИЛІ ДЛЯ КРАСИВОГО ПОРОЖНЬОГО СТАНУ КОШИКА */
.empty-state-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: #fdfdfd;
  border: 1px dashed #3498db; /* Синій пунктир */
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;

  .bag-icon { font-size: 4rem; margin-bottom: 1rem; color: #3498db; }
  h2 { font-size: 1.5rem; color: #333; margin-bottom: 0.5rem; }
  p { color: #666; margin-bottom: 1.5rem; }

  .explore-btn {
    background: #42b983;
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;
    &:hover { background: #3c9d75; }
  }
}
/* --- Кінець нових стилів --- */


.cart-layout { display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; @media (max-width: 768px) { grid-template-columns: 1fr; } }
.cart-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; border-bottom: 1px solid #eee; background: white; }
.item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 4px; }
.item-details { flex-grow: 1; h3 { font-size: 1rem; margin-bottom: 0.5rem; } .price { font-weight: bold; color: #2c3e50; } }
.remove-btn { color: #dc3545; background: none; border: 1px solid #dc3545; padding: 5px 10px; border-radius: 4px; cursor: pointer; &:hover { background: #dc3545; color: white; } }
.cart-summary { background: #f9f9f9; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05); height: fit-content; }
.summary-details { display: flex; justify-content: space-between; margin-bottom: 10px; p { margin: 0; } &.total { border-top: 1px solid #eee; padding-top: 10px; font-weight: bold; font-size: 1.1rem; } }
.checkout-btn { width: 100%; background: #2c3e50; color: white; border: none; padding: 12px; border-radius: 4px; cursor: pointer; font-size: 1.1rem; margin-top: 1.5rem; transition: background 0.2s; &:hover { background: #34495e; } }
.clear-btn { width: 100%; padding: 8px; background: none; border: none; color: #666; cursor: pointer; text-decoration: underline; }
</style>
