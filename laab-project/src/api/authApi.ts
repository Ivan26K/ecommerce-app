import apiClient from './axiosInstance'
import type { User, LoginPayload, AuthResponse } from '@/types/types'

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  avatar: string;
}

export const authApi = {
  // Логін
  async login(payload: LoginPayload) {
    const response = await apiClient.post<AuthResponse>('/auth/login', payload)
    return response.data
  },

  // Реєстрація
  async register(payload: CreateUserPayload) {
    const response = await apiClient.post<User>('/users/', payload)
    return response.data
  },

  // Отримання профілю
  async getProfile() {
    const token = localStorage.getItem('access_token')
    const response = await apiClient.get<User>('/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}
