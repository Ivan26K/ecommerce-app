<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { productsApi } from '@/api/productsApi'
import type { Product } from '@/types/types'
import { useCartStore } from '@/modules/user/store/cartStore'
import { useFavoritesStore } from '@/modules/user/store/favoritesStore'
import { useAuthStore } from '@/modules/user/store/authStore'
import { useToastStore } from '@/modules/user/store/toastStore'

const route = useRoute()
const cartStore = useCartStore()
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()
const toastStore = useToastStore()


const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Витягуємо ID з URL
const productId = computed(() => Number(route.params.id))
const isFav = computed(() => product.value ? favoritesStore.isFavorite(product.value.id) : false)


const fetchProductDetails = async () => {
  if (!productId.value) {
    error.value = 'Product ID is missing.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  try {
    product.value = await productsApi.getProductById(productId.value)
  } catch (err) {
    console.error(err)
    error.value = 'Could not load product details.'
  } finally {
    loading.value = false
  }
}

const handleAddToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value)
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

  if (product.value) {
    const added = favoritesStore.toggleFavorite(product.value)
    if (added) {
      toastStore.showToast({
        message: `${product.value.title} added to Favorites! Click to view.`,
        type: 'success',
        timeout: 3000,
        to: '/favorites'
      })
    } else {
      toastStore.showToast({
        message: `${product.value.title} removed from Favorites.`,
        type: 'info',
        timeout: 3000
      })
    }
  }
}


onMounted(fetchProductDetails)
</script>

<template>
  <div class="product-detail-container">
    <div v-if="loading" class="loading-state">Loading product details...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="product" class="product-layout">

      <div class="image-gallery">
        <div
          v-for="(image, index) in product.images.filter(img => img && img.startsWith('http'))"
          :key="index"
          class="main-image"
        >
          <img :src="image" :alt="product.title" />
        </div>
      </div>

      <div class="details-content">
        <span class="category-tag">{{ product.category.name }}</span>

        <button
          @click.prevent="handleToggleFavorite"
          class="favorite-btn"
          :class="{ 'is-active': isFav }"
        >
          {{ isFav ? '♥ Saved' : '♡ Save to Favorites' }}
        </button>

        <h1>{{ product.title }}</h1>

        <p class="description">{{ product.description }}</p>

        <div class="price-section">
          <span class="price">${{ product.price }}</span>
          <p class="availability">In Stock</p>
        </div>

        <button @click="handleAddToCart" class="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
    <div v-else class="error-state">Product not found.</div>
  </div>
</template>

<style scoped lang="scss">
.product-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;

  .main-image {
    width: 100%;
    height: 400px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.05);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.details-content {
  padding-top: 20px;
  position: relative;

  .category-tag {
    display: inline-block;
    background-color: #f1f1f1;
    color: #555;
    padding: 5px 10px;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .favorite-btn {
    position: absolute;
    top: 20px;
    right: 0;
    background: none;
    border: 1px solid #ccc;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    color: #555;
    transition: all 0.2s;
    font-size: 1rem;

    &.is-active {
      background: #e74c3c;
      color: white;
      border-color: #e74c3c;
    }
  }

  h1 {
    font-size: 2rem;
    margin-bottom: 15px;
    color: #2c3e50;
  }

  .description {
    line-height: 1.6;
    color: #666;
    margin-bottom: 30px;
  }

  .price-section {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;

    .price {
      font-size: 2.5rem;
      font-weight: bold;
      color: #42b983;
    }

    .availability {
      color: green;
      font-weight: 600;
    }
  }

  .add-to-cart-btn {
    width: 100%;
    max-width: 300px;
    padding: 15px;
    background-color: #2c3e50;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1.1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #34495e;
    }
  }
}

.loading-state, .error-state {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #c0392b;
}
</style>
