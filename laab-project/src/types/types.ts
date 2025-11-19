// src/types/types.ts

export interface Category {
  id: number;
  name: string;
  image: string;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: Category;
  images: string[];
}

// Типи для юзера (знадобляться пізніше, хай будуть тут, щоб 2 рази не бігати)
export interface User {
  id: number;
  email: string;
  password?: string;
  name: string;
  role: string;
  avatar: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}
