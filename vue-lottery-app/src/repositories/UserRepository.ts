// src/repositories/UserRepository.ts
import api from './BaseRepository'
import type { User } from '@/types/User'

export class UserRepository {
  async getAll(): Promise<User[]> {
    const { data } = await api.get('/users')
    return data
  }

  async getById(id: number): Promise<User> {
    const { data } = await api.get(`/users/${id}`)
    return data
  }

  async create(user: Omit<User, 'id'>): Promise<User> {
    const { data } = await api.post('/users', user)
    return data
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    const { data } = await api.put(`/users/${id}`, user)
    return data
  }
}
