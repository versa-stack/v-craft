<template>
  <component :is="tagName">{{ content }}</component>
</template>
<script lang="ts">
export default {
  name: "CraftComponentSimpleText",
};
</script>
<script lang="ts" setup>
const props = withDefaults(
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
