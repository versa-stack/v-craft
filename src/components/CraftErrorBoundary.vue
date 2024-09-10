<template>
  <slot v-if="!error"></slot>
  <div v-else class="fvc-error-boundary">
    <h2 class="fvc-error-title">Oops! Something went wrong</h2>
    <p class="fvc-error-message">{{ error }}</p>
    <button @click="resetError" class="fvc-error-button">Close</button>
  </div>
</template>

<script>
import { ref, provide } from 'vue'

export default {
  name: 'ErrorBoundary',
  setup() {
    const error = ref(null)

    provide('errorBoundary', {
      captureError: (err) => {
        console.error(err)
        error.value = err
      }
    })

    const resetError = () => {
      error.value = null
    }

    return { error, resetError }
  },
  errorCaptured(err) {
    this.error = err
    return false
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/errorBoundary';
</style>