<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useFavoritesStore } from '@/modules/user/store/favoritesStore'
import { useAuthStore } from '@/modules/user/store/authStore'
import ProductCard from '@/modules/products/components/ProductCard.vue'
import { useRouter, RouterLink } from 'vue-router'

const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const { favorites } = storeToRefs(favoritesStore)
const { isAuthenticated } = storeToRefs(authStore)
const router = useRouter()

const goToProducts = () => {
  router.push('/products')
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="container">
    <h1 class="page-title">My Favorites</h1>

    <div v-if="!isAuthenticated" class="auth-required-state">
      <span class="lock-icon">🔒</span>
      <h2>Access Denied</h2>
      <p>This feature is available only to registered users. Please log in to view your saved items.</p>
      <button @click="goToLogin" class="login-btn">
        Login or Sign Up
      </button>
    </div>

    <div v-else-if="favorites.length === 0" class="empty-state-enhanced">
      <span class="heart-icon">💔</span>
      <h2>Your Favorites List is Empty</h2>
      <p>It looks like you haven't decided what to save yet. Start exploring now!</p>
      <button @click="goToProducts" class="explore-btn">
        Start Exploring Products
      </button>
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in favorites"
        :key="product.id"
        :product="product"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 70vh;
}

.page-title {
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
  color: #2c3e50;
}

/* СТИЛІ ДЛЯ ЗАХИЩЕНОГО СТАНУ */
.auth-required-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: #fff0f0;
  border: 2px solid #e74c3c;
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;

  .lock-icon { font-size: 4rem; margin-bottom: 1rem; }
  h2 { font-size: 1.8rem; color: #e74c3c; margin-bottom: 0.5rem; }
  p { color: #666; margin-bottom: 1.5rem; font-size: 1.1rem; }

  .login-btn {
    background: #2c3e50;
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: #34495e; }
  }
}


/* ✅ СТИЛІ ДЛЯ КРАСИВОГО ПОРОЖНЬОГО СТАНУ (Favorites) */
.empty-state-enhanced {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  background: #fdfdfd;
  border: 1px dashed #e74c3c; /* Червоний пунктир */
  border-radius: 12px;
  text-align: center;
  margin-top: 3rem;

  .heart-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    animation: pulse 1s infinite alternate;
  }

  h2 { font-size: 1.5rem; color: #333; margin-bottom: 0.5rem; }
  p { color: #666; margin-bottom: 1.5rem; }

  .explore-btn {
    background: #e74c3c; /* Червона кнопка */
    color: white;
    border: none;
    padding: 10px 25px;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.2s;

    &:hover { background: #c0392b; }
  }
}

/* Анімація для сердечка */
@keyframes pulse {
  from { transform: scale(1); }
  to { transform: scale(1.05); }
}


.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
}
</style>
