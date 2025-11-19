<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Вхід</h2>

            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <Field
                  name="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  placeholder="eve.holt@reqres.in"
                />
                <ErrorMessage name="email" class="text-danger small mt-1" />
              </div>

              <div class="mb-3">
                <label class="form-label">Пароль</label>
                <Field
                  name="password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="cityslicka"
                />
                <ErrorMessage name="password" class="text-danger small mt-1" />
              </div>

              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Увійти
              </button>
            </Form>

            <div class="mt-3 text-center">
              <small class="text-muted">
                Тестові дані: eve.holt@reqres.in + cityslicka
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as yup from 'yup'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

const schema = yup.object({
  email: yup.string().email('Невірний email').required("Обов'язкове поле"),
  password: yup.string().min(6, 'Мінімум 6 символів').required("Обов'язкове поле"),
})

const onSubmit = async (values: any) => {
  loading.value = true
  try {
    await authStore.login(values.email, values.password)
    router.push('/lottery')
  } catch (error) {
    alert('Помилка авторизації. Перевірте дані.')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
