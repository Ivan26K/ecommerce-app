<script setup lang="ts">
import type { Product } from '@/types/types'
import { useCartStore } from '@/modules/user/store/cartStore'
import { useFavoritesStore } from '@/modules/user/store/favoritesStore'
import { useAuthStore } from '@/modules/user/store/authStore'
import { useToastStore } from '@/modules/user/store/toastStore'
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps<{
  product: Product
}>()

const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toastStore = useToastStore()

const isFav = computed(() => favoritesStore.isFavorite(props.product.id))

const handleAddToCart = () => {
  if (props.product) {
    cartStore.addToCart(props.product)
  }
}

const handleToggleFavorite = () => {
  if (!authStore.isAuthenticated) {
    toastStore.showToast({
      message: 'Please log in to add products to your favorites.',
      type: 'error',
      timeout: 4000
    })
    return
  }

  const added = favoritesStore.toggleFavorite(props.product)
  if (added) {
    toastStore.showToast({
      message: `${props.product.title} added to Favorites! Click to view.`,
      type: 'success',
      timeout: 3000,
      to: '/favorites'
    })
  } else {
    toastStore.showToast({
      message: `${props.product.title} removed from Favorites.`,
      type: 'info',
      timeout: 3000
    })
  }
}
</script>

<template>
  <div class="product-card">

    <RouterLink :to="`/products/${product.id}`" class="card-link">
      <div class="image-wrapper">
        <img :src="product.images[0]?.startsWith('http') ? product.images[0] : 'https://i.imgur.com/Gj0K5dJ.jpeg'" :alt="product.title" class="product-image" />

        <button
          class="favorite-btn"
          :class="{ 'is-active': isFav }"
          @click.prevent="handleToggleFavorite"
        >
          ♥
        </button>
      </div>

      <div class="card-body">
        <h3 class="product-title">{{ product.title }}</h3>
        <p class="product-category">{{ product.category.name }}</p>

        <div class="price-section">
          <span class="product-price">${{ product.price }}</span>
        </div>
      </div>
    </RouterLink>

    <div class="card-actions">
      <button @click="handleAddToCart" class="add-btn">Add to Cart</button>
    </div>

  </div>
</template>

<style scoped lang="scss">
.product-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  flex-grow: 1;
}

.image-wrapper {
  height: 220px;
  overflow: hidden;
  position: relative;

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .favorite-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 1.2rem;
    color: #ccc;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: 3px;
    z-index: 10;

    &:hover { transform: scale(1.1); }
    &.is-active { color: #e74c3c; }
  }
}

.card-body {
  padding: 1rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-category {
  color: #888;
  font-size: 0.85rem;
  margin-bottom: auto;
}

.price-section {
  margin-top: 1rem;
  .product-price {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2c3e50;
  }
}

.card-actions {
  padding: 0 1rem 1rem 1rem;
}

.add-btn {
  width: 100%;
  background-color: #2c3e50;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  &:hover { background-color: #34495e; }
}
</style>
