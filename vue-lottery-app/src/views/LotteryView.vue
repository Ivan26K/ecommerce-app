<template>
  <div class="container py-4">
    <h2 class="mb-4">Учасники лотереї</h2>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Завантаження...</span>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else>
      <div class="table-responsive">
        <table class="table table-hover align-middle">
          <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Аватар</th>
            <th>Ім'я</th>
            <th>Email</th>
            <th>Роль</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>
              <img :src="user.avatar" class="rounded-circle" width="40" height="40" />
            </td>
            <td>
              <router-link :to="`/users/${user.id}`" class="text-decoration-none">
                {{ user.name }}
              </router-link>
            </td>
            <td>{{ user.email }}</td>
            <td><span class="badge bg-secondary">{{ user.role }}</span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { UserRepository } from '@/repositories/UserRepository'
import type { User } from '@/types/User'

const users = ref<User[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const repo = new UserRepository()

onMounted(async () => {
  try {
    users.value = await repo.getAll()
  } catch (err) {
    error.value = 'Не вдалося завантажити учасників'
  } finally {
    loading.value = false
  }
})
</script>
