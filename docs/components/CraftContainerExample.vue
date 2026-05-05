<template>
  <div class="my-4 flex flex-col gap-6 shadow-md">
    <header class="border-b border-slate-200 pb-4 mb-4 font-semibold min-h-8">
      <slot name="header" />
    </header>
    <main class="min-h-16">
      <slot name="body" />
    </main>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "CraftContainerExample",
});
</script>
