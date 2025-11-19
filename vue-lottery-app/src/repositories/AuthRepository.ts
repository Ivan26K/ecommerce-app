// src/repositories/AuthRepository.ts
import api from './BaseRepository'
import type { LoginCredentials, AuthResponse } from '@/types/User'

export class AuthRepository {
  async login(credentials: LoginCredentials): Promise<string> {
    const { data } = await api.post<AuthResponse>('/auth/login', credentials)
    return data.access_token
  }
}
