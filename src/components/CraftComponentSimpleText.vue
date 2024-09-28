<template>
  <component :is="componentName">{{ content }}</component>
</template>
<script lang="ts" setup>

defineOptions({
  name: "CraftComponentSimpleText",
})

withDefaults(
  defineProps<{
    componentName?: string;
    content?: string;
  }>(),
  {
    componentName: "p",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  }
);
</script>
