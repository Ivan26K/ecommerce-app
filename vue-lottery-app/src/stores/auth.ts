// src/stores/auth.ts
import { defineStore } from 'pinia'
import { AuthRepository } from '@/repositories/AuthRepository'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    async login(email: string, password: string) {
      const repo = new AuthRepository()
      const token = await repo.login({ email, password })
      this.token = token
      localStorage.setItem('token', token)
    },

    logout() {
      this.token = null
      localStorage.removeItem('token')
    },
  },
})
