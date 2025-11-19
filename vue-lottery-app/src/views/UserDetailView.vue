<template>
  <div class="container py-4">
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <div v-else-if="user" class="row">
      <div class="col-md-4 text-center">
        <img :src="user.avatar" class="img-fluid rounded-circle" style="max-width: 200px;" />
      </div>
      <div class="col-md-8">
        <h2>{{ user.name }}</h2>
        <table class="table table-borderless">
          <tr><td><strong>ID:</strong></td><td>{{ user.id }}</td></tr>
          <tr><td><strong>Email:</strong></td><td>{{ user.email }}</td></tr>
          <tr><td><strong>Роль:</strong></td><td><span class="badge bg-primary">{{ user.role }}</span></td></tr>
        </table>
      </div>
      <div class="mt-3">
        <router-link to="/lottery" class="btn btn-outline-secondary">
          Назад до списку
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { UserRepository } from '@/repositories/UserRepository'
import type { User } from '@/types/User'

const route = useRoute()
const user = ref<User | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const repo = new UserRepository()

onMounted(async () => {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    error.value = 'Невірний ID'
    loading.value = false
    return
  }

  try {
    user.value = await repo.getById(id)
  } catch (err) {
    error.value = 'Користувача не знайдено'
  } finally {
    loading.value = false
  }
})
</script>
