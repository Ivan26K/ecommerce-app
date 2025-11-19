
import apiClient from './axiosInstance'
import type { Product, Category } from '@/types/types'

export interface ProductParams {
  offset?: number;
  limit?: number;
  title?: string;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
}

export const productsApi = {
  // Отримати продукти з фільтрами та пагінацією
  async getProducts(params: ProductParams = {}) {
    const response = await apiClient.get<Product[]>('/products', { params })
    return response.data
  },

  // Отримати деталі одного продукту
  async getProductById(id: number) {
    const response = await apiClient.get<Product>(`/products/${id}`)
    return response.data
  },

  async getCategories() {
    const response = await apiClient.get<Category[]>('/categories')
    return response.data
  }
}
