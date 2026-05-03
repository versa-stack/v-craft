<template>
  <div class="border-2 border-gray-300 rounded-lg p-4 my-2 bg-gray-50 flex flex-col gap-2">
    <div class="border-b border-gray-300 pb-2 mb-2 font-bold min-h-[20px]">
      <slot name="header" />
    </div>
    <div class="min-h-[40px]">
      <slot name="body" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "CraftContainerExample",
});
</script>
