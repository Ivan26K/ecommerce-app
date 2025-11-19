<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/modules/user/store/authStore'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { loading, error } = storeToRefs(authStore)
const router = useRouter()

// Platzi API вимагає і аватарку, тому даємо дефолтну
const form = ref({
  name: '',
  email: '',
  password: '',
  avatar: 'https://i.imgur.com/LDOO4Qs.jpg'
})

const handleRegister = async () => {
  try {
    await authStore.register(form.value)
    router.push('/') // Після успіху на головну
  } catch (e) {
    // Помилка вже в store
  }
}
</script>

<template>
  <div class="register-container">
    <div class="card">
      <h1>Create Account</h1>
      <p class="subtitle">Join our shop today</p>

      <form @submit.prevent="handleRegister" class="register-form">
        <div class="form-group">
          <label>Name</label>
          <input v-model="form.name" type="text" required placeholder="Your Name" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" required placeholder="email@example.com" />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" required minlength="4" placeholder="••••••" />
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>

        <button type="submit" :disabled="loading" class="submit-btn">
          {{ loading ? 'Creating Account...' : 'Sign Up' }}
        </button>
      </form>

      <p class="link-text">
        Already have an account? <router-link to="/login">Login here</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.register-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  padding: 20px;
}

.card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;

  h1 { margin-bottom: 0.5rem; color: #333; }
  .subtitle { color: #666; margin-bottom: 2rem; }
}

.register-form {
  text-align: left;

  .form-group {
    margin-bottom: 1.2rem;
    label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
    input {
      width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px;
      &:focus { outline: none; border-color: #42b983; }
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;

  &:hover { background: #3aa876; }
  &:disabled { background: #ccc; cursor: not-allowed; }
}

.error-message {
  color: #dc3545;
  background: #f8d7da;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 1rem;
}

.link-text {
  margin-top: 1.5rem;
  font-size: 0.9rem;
  a { color: #42b983; font-weight: bold; text-decoration: none; }
}
</style>
