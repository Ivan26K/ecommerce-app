<script setup lang="ts">
import { onMounted, watch, computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/modules/products/store/productsStore'
import ProductCard from '@/modules/products/components/ProductCard.vue'
import ProductFilters, { type FilterParams } from '@/modules/products/components/ProductFilters.vue'

// Визначаємо тип SortBy (повинен збігатися з Pinia Store)
type SortBy = 'none' | 'title-asc' | 'price-asc' | 'price-desc';

const productsStore = useProductsStore()
const { sortedProducts, loading, error, sortBy } = storeToRefs(productsStore)
const { setSortBy } = productsStore;

const route = useRoute()
const router = useRouter()

const limit = 10
const offset = ref(Number(route.query.offset) || 0)

const initialFilters = computed<FilterParams>(() => ({
  title: route.query.title as string | undefined,
  price_min: route.query.price_min ? Number(route.query.price_min) : undefined,
  price_max: route.query.price_max ? Number(route.query.price_max) : undefined,
  categoryId: route.query.categoryId ? Number(route.query.categoryId) : undefined,
}))

const loadData = () => {
  productsStore.fetchProducts({
    ...route.query,
    offset: offset.value,
    limit
  })
}

const onFilterUpdate = (newFilters: FilterParams) => {
  offset.value = 0
  router.push({
    query: {
      ...route.query,
      ...newFilters,
      offset: 0
    }
  })
}

const changePage = (direction: 'next' | 'prev') => {
  if (direction === 'next') offset.value += limit
  else if (offset.value > 0) offset.value -= limit

  router.push({
    query: { ...route.query, offset: offset.value }
  })

  window.scrollTo({ top: 0, behavior: 'smooth' })
}

watch(() => route.query, loadData, { deep: true })

onMounted(loadData)
</script>

<template>
  <div class="container page-layout">
    <aside class="sidebar">
      <ProductFilters
        :initial-filters="initialFilters"
        @update-filters="onFilterUpdate"
      />
    </aside>

    <main class="content">
      <div class="content-header">
        <h1 class="page-title">Catalog</h1>

        <div class="sort-controls">
          <label for="sort-by">Sort By:</label>
          <select id="sort-by" :value="sortBy" @change="e => setSortBy((e.target as HTMLSelectElement).value as SortBy)">
            <option value="none">Default</option>
            <option value="title-asc">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>


      <div v-if="loading" class="loading">Loading products...</div>
      <div v-else-if="error" class="error">{{ error }}</div>

      <div v-else-if="sortedProducts.length === 0" class="no-results">
        <h2>Object not found!</h2>
        <p>No products match your current filters or search criteria.</p>
      </div>

      <div v-else>
        <div class="products-grid">
          <ProductCard
            v-for="product in sortedProducts"
            :key="product.id"
            :product="product"
          />
        </div>

        <div class="pagination">
          <button
            :disabled="offset === 0"
            @click="changePage('prev')"
            class="page-btn"
          >
            Previous
          </button>
          <span class="page-info">Page {{ offset / limit + 1 }}</span>
          <button
            :disabled="sortedProducts.length < limit"
            @click="changePage('next')"
            class="page-btn"
          >
            Next
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped lang="scss">
// ... існуючі стилі
.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  border-radius: 8px;

  h2 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  .page-title { margin: 0; }
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 10px;

  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ddd;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.5rem;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;

  .page-btn {
    padding: 0.5rem 1rem;
    background: #333;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
