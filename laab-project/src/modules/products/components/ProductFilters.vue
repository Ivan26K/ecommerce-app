<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useProductsStore } from '@/modules/products/store/productsStore'
import { storeToRefs } from 'pinia'

// Тип параметрів для зручності
export interface FilterParams {
  title?: string
  price_min?: number
  price_max?: number
  categoryId?: number
}

const props = defineProps<{
  // Приймаємо початкові значення з URL
  initialFilters: FilterParams
}>()

const emit = defineEmits(['update-filters'])

const productsStore = useProductsStore()
const { categories } = storeToRefs(productsStore)

// Локальний стан форми фільтрів
const filters = ref<FilterParams>({
  title: props.initialFilters.title || undefined,
  price_min: props.initialFilters.price_min || undefined,
  price_max: props.initialFilters.price_max || undefined,
  categoryId: props.initialFilters.categoryId || undefined
})

// Завантажуємо категорії при монтуванні
onMounted(() => {
  productsStore.fetchCategories()
})

// Слідкуємо за змінами у формі та повідомляємо батьківський компонент
watch(filters, (newFilters) => {
  // Функція для очищення від порожніх або нульових значень
  const cleanFilters = Object.fromEntries(
    Object.entries(newFilters).filter(([_, v]) => v != null && v !== '')
  ) as FilterParams

  emit('update-filters', cleanFilters)
}, { deep: true })
</script>

<template>
  <aside class="filters-sidebar">
    <h3>Filters</h3>

    <div class="filter-group">
      <label>Search by Name</label>
      <input
        v-model="filters.title"
        type="text"
        placeholder="Product name..."
        class="form-control"
      />
    </div>

    <div class="filter-group">
      <label>Price Range</label>
      <div class="price-inputs">
        <input v-model.number="filters.price_min" type="number" placeholder="Min" />
        <span>-</span>
        <input v-model.number="filters.price_max" type="number" placeholder="Max" />
      </div>
    </div>

    <div class="filter-group">
      <label>Category</label>
      <select v-model.number="filters.categoryId" class="form-control">
        <option :value="undefined">All Categories</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>
  </aside>
</template>

<style scoped lang="scss">
.filters-sidebar {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;

  h3 { margin-bottom: 1rem; }

  .filter-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
    }

    .form-control {
      width: 100%;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .price-inputs {
      display: flex;
      gap: 5px;
      align-items: center;

      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
    }
  }
}
</style>
