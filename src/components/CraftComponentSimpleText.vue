<template>
  <component :is="tagName">{{ content }}</component>
</template>
<script lang="ts" setup>

defineOptions({
  name: "CraftComponentSimpleText",
})

withDefaults(
  defineProps<{
    tagName: string;
    content: string;
  }>(),
  {
    tagName: "p",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  }
);
</script>
