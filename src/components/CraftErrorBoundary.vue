<template>
  <slot v-if="!error"></slot>
  <div v-else class="fvc-error-boundary">
    <h2 class="fvc-error-title">Oops! Something went wrong</h2>
    <p class="fvc-error-message">{{ error }}</p>
    <button @click="resetError" class="fvc-error-button">Close</button>
  </div>
</template>

<script setup lang="ts">
import { ref, provide, onErrorCaptured } from "vue";

const error = ref<Error | null>(null);

provide("errorBoundary", {
  captureError: (err: Error) => {
    console.error(err);
    error.value = err;
  },
});

const resetError = () => {
  error.value = null;
};

onErrorCaptured((err) => {
  error.value = err;
  return false;
});

defineOptions({
  name: "ErrorBoundary",
});
</script>

<style lang="scss" scoped>
@import "../assets/errorBoundary";
</style>
