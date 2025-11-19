<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/user/store/authStore'
import { storeToRefs } from 'pinia'

const router = useRouter()
const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)

// Дані форми (для тесту Platzi API має конкретний логін/пароль)
// Ми відразу їх впишемо, щоб вам не шукати
const email = ref('kioreskonik@gmail.com')
const password = ref('nnn123')

const handleLogin = async () => {
  try {
    // Викликаємо action зі стору
    await authStore.login({
      email: email.value,
      password: password.value
    })

    // Якщо успішно — переходимо на головну
    router.push('/')
  } catch (e) {
    // Помилка вже оброблена в store і записана в змінну error
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h1>Welcome Back</h1>
      <p class="subtitle">Login to access your favorites</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="•••@gmail.com"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>

      <p class="hint">
        Hint: Use <b>kioreskonik@gmail.com</b> / <b>nnn123</b> (Platzi Fake User)
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.login-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;

  h1 { margin-bottom: 0.5rem; color: #333; }
  .subtitle { color: #666; margin-bottom: 2rem; }
}

.login-form {
  text-align: left;

  .form-group {
    margin-bottom: 1.5rem;

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.3s;

      &:focus {
        border-color: #42b983;
        outline: none;
      }
    }
  }
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background-color: #3aa876; }
  &:disabled { background-color: #a8d5c2; cursor: not-allowed; }
}

.hint {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #888;
}
</style>
