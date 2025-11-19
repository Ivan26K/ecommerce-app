<template>
  <AppHeader />
  <AppNavigation />
  <main>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue'
import AppNavigation from '@/components/AppNavigation.vue'
</script>

<style>
main {
  min-height: calc(100vh - 140px);
}
</style>
