import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { productsApi, type ProductParams } from '@/api/productsApi'
import type { Product, Category } from '@/types/types'

// Визначення типів сортування
type SortBy = 'none' | 'title-asc' | 'price-asc' | 'price-desc';

export const useProductsStore = defineStore('products', () => {
  // --- State ---
  const products = ref<Product[]>([]) // Сирі дані з API
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const sortBy = ref<SortBy>('none'); // Стан для вибору сортування

  // --- Getters ---
  const sortedProducts = computed(() => {
    if (sortBy.value === 'none') {
      return products.value;
    }

    // Клонуємо масив для сортування, щоб не змінювати сирі дані
    const items = [...products.value];

    // Логіка сортування
    return items.sort((a, b) => {
      if (sortBy.value === 'title-asc') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy.value === 'price-asc') {
        return a.price - b.price;
      }
      if (sortBy.value === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });
  });

  // --- Actions ---

  async function fetchProducts(params: ProductParams = {}) {
    loading.value = true
    error.value = null
    try {
      products.value = await productsApi.getProducts(params)
    } catch (err: any) {
      error.value = 'Failed to load products'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    try {
      categories.value = await productsApi.getCategories()
    } catch (err) {
      console.error('Failed to load categories', err)
    }
  }

  // Action для встановлення параметру сортування
  function setSortBy(value: SortBy) {
    sortBy.value = value;
  }

  // --- ЕКСПОРТ ---
  return {
    sortedProducts, // <--- Експортуємо відсортований список
    categories,
    loading,
    error,
    sortBy,
    fetchProducts,
    fetchCategories,
    setSortBy
  }
})
