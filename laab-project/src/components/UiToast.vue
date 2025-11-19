<script setup lang="ts">
import { useToastStore } from '@/modules/user/store/toastStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

const toastStore = useToastStore()
const { toast, isVisible } = storeToRefs(toastStore)
const router = useRouter()

const handleClose = () => {
  toastStore.hideToast()
}

// Функція для клікабельності повідомлення та навігації
const handleClick = () => {
  if (toast.value.to) {
    router.push(toast.value.to)
    handleClose()
  }
}
</script>

<template>
  <Transition name="toast">
    <div
      v-if="isVisible"
      class="ui-toast"
      :class="[`ui-toast--${toast.type}`, { 'is-clickable': !!toast.to }]"
      @click="handleClick"
    >
      <div class="toast-content">
        <p class="toast-message">{{ toast.message }}</p>
      </div>
      <button @click.stop="handleClose" class="toast-close">&times;</button>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.ui-toast {
  position: fixed;
  bottom: 20px;
  right: 20px;

  padding: 15px 40px 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.is-clickable {
  cursor: pointer;
  &:hover {
    opacity: 0.95;
    transform: translateY(-2px);
  }
}

.toast-message { margin: 0; font-weight: 500; line-height: 1.4; }

.toast-close {
  position: absolute;
  top: 5px;
  right: 10px;
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
  &:hover { opacity: 1; }
}

/* Типи повідомлень */
.ui-toast--success { background-color: #42b983; color: white; }
.ui-toast--error { background-color: #e74c3c; color: white; }
.ui-toast--info { background-color: #3498db; color: white; }

/* Transition styles */
.toast-enter-active,
.toast-leave-active { transition: all 0.5s ease; }

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(100%) translateX(0);
}
</style>
