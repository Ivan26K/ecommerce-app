<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from '@/modules/user/store/authStore'
import { useCartStore } from '@/modules/user/store/cartStore'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import UiToast from '@/components/UiToast.vue'

// Ініціалізація Pinia Stores
const authStore = useAuthStore()
const cartStore = useCartStore()

// Отримання реактивних даних
const { user, isAuthenticated } = storeToRefs(authStore)
const { totalItems } = storeToRefs(cartStore)

/**
 * Генерує ініціали, використовуючи безпечну перевірку
 */
const getUserInitials = (fullName: string | undefined): string => {
  if (!fullName) return '?'

  const parts = fullName.trim().split(/\s+/).filter(p => p.length > 0)

  if (parts.length === 0) return '?'

  const firstPart = parts[0];
  const secondPart = parts[1];

  const firstInitial = firstPart && firstPart[0] ? firstPart[0].toUpperCase() : '?'

  if (!secondPart) {
    return firstInitial
  }

  const secondInitial = secondPart && secondPart[0] ? secondPart[0].toUpperCase() : ''

  return firstInitial + secondInitial
}

onMounted(() => {
  authStore.fetchProfile()
})
</script>

<template>
  <div class="app-layout-container">
    <header class="app-header">
      <div class="container nav-wrapper">
        <RouterLink to="/" class="logo">PepneShop</RouterLink>

        <nav class="nav-links">

          <RouterLink to="/products">Products</RouterLink>

          <RouterLink to="/cart" class="cart-link">
            Cart <span v-if="totalItems > 0" class="badge">{{ totalItems }}</span>
          </RouterLink>

          <template v-if="!isAuthenticated">
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register" class="register-btn">Sign Up</RouterLink>
          </template>

          <template v-else-if="user">
            <RouterLink to="/favorites" class="fav-link">♥ Favorites</RouterLink>

            <div class="user-menu">
              <div class="avatar initials-avatar">
                {{ getUserInitials(user.name) }}
              </div>

              <span class="username">{{ user.name }}</span>
              <button @click="authStore.logout()" class="logout-btn">Logout</button>
            </div>
          </template>

          <template v-else>
            <div class="loading-placeholder"></div>
          </template>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>

    <!-- Футер -->
    <footer class="app-footer">
      <div class="footer-content">
        <h3>Development Team</h3>
        <div class="team-grid">
          <a href="https://github.com/Ivan26K" target="_blank" class="student-link">
            Кіореско Іван Михайлович
          </a>
          <a href="https://github.com/fnayed" target="_blank" class="student-link">
            Сирбу Антон Антонович
          </a>
          <a href="https://github.com/djudax" target="_blank" class="student-link">
            Чупак Дмитро Артемович
          </a>
        </div>
        <p class="copyright">© 2025 VueShop Project.</p>
      </div>
    </footer>

    <UiToast />
  </div>
</template>

<style scoped lang="scss">
:global(html, body, #app) { height: 100%; margin: 0; }
.app-layout-container { display: flex; flex-direction: column; min-height: 100vh; }
main { flex-grow: 1; }

.app-header { background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.05); position: sticky; top: 0; z-index: 100; }
.nav-wrapper { max-width: 1200px; margin: 0 auto; padding: 1rem 20px; display: flex; justify-content: space-between; align-items: center; }
.logo { font-size: 1.5rem; font-weight: 800; color: #2c3e50; text-decoration: none; }
.nav-links { display: flex; align-items: center; gap: 1.5rem; a { text-decoration: none; color: #2c3e50; font-weight: 500; transition: color 0.2s; &:hover { color: #42b983; } &.router-link-active { color: #42b983; } } .register-btn { background: #2c3e50; color: white !important; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; &:hover { background: #34495e; } } .cart-link { position: relative; .badge { background: #e74c3c; color: white; font-size: 0.7rem; padding: 2px 6px; border-radius: 10px; position: absolute; top: -8px; right: -10px; } } .fav-link { color: #e74c3c !important; } }
.user-menu { display: flex; align-items: center; gap: 10px; padding-left: 10px; border-left: 1px solid #eee; .initials-avatar { width: 32px; height: 32px; border-radius: 50%; background: #2c3e50; color: white; display: flex; justify-content: center; align-items: center; font-size: 0.85rem; font-weight: bold; flex-shrink: 0; } .logout-btn { background: none; border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; cursor: pointer; transition: all 0.2s; &:hover { background: #e74c3c; color: white; border-color: #e74c3c; } } }
.loading-placeholder { width: 150px; height: 32px; background: #f1f1f1; border-radius: 4px; }

.app-footer { background: #2c3e50; color: white; padding: 0.75rem 20px; margin-top: 2rem; }
.footer-content { max-width: 800px; margin: 0 auto; text-align: center; h3 { margin-bottom: 0.5rem; font-size: 0.9rem; padding: 0; border: none; opacity: 0.9; } }
.team-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 0.3rem; margin-bottom: 0.5rem; }
.student-link { display: block; text-decoration: none; padding: 4px 6px; background: #34495e; color: white; border-radius: 4px; font-size: 0.7rem; transition: background 0.2s, transform 0.2s; cursor: pointer; white-space: nowrap; &:hover { background: #42b983; transform: translateY(-2px); box-shadow: 0 2px 5px rgba(0,0,0,0.3); } }
.copyright { border-top: 1px solid #34495e; padding-top: 0.5rem; font-size: 0.7rem; color: #7f8c8d; }
</style>
