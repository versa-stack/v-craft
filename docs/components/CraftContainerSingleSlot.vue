<template>
  <div class="border-2 border-blue-300 rounded-lg p-4 my-2 bg-blue-50">
    <slot />
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "CraftContainerSingleSlot",
});
</script>
