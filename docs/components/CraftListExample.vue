<template>
  <ul class="craft-list-example">
    <li v-for="(item, index) in items" :key="index">
      <slot :item="item" :index="index" />
    </li>
  </ul>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    items?: { title: string; description: string }[];
  }>(),
  {
    items: () => [
      { title: "First item", description: "Description for the first item." },
      { title: "Second item", description: "Description for the second item." },
      { title: "Third item", description: "Description for the third item." },
    ],
  },
);

defineOptions({
  name: "CraftListExample",
});
</script>

<style scoped>
.craft-list-example {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.craft-list-example > li {
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
  padding: 0.5em 0.75em;
}
</style>
