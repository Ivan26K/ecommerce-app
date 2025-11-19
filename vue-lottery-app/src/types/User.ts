// src/types/User.ts
export interface User {
  id: number
  email: string
  password: string
  name: string
  role: string
  avatar: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  access_token: string
}
