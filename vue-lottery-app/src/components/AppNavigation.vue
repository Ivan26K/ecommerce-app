<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light shadow-sm mb-4">
    <div class="container-fluid">
      <div class="navbar-nav mx-auto">
        <router-link
          to="/"
          class="nav-link"
          active-class="active"
          exact-active-class="active"
        >Home</router-link>
        <router-link
          to="/about"
          class="nav-link"
          active-class="active"
        >About</router-link>
        <router-link
          to="/lottery"
          class="nav-link"
          active-class="active"
        >Lottery</router-link>
        <template v-if="!authStore.isAuthenticated">
          <router-link
            to="/login"
            class="nav-link"
            active-class="active"
          >Login</router-link>
        </template>
        <button
          v-else
          @click="authStore.logout"
          class="btn btn-outline-danger btn-sm ms-2"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
