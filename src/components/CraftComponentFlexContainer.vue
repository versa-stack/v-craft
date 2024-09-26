<template>
  <div class="flex-container" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, CSSProperties } from "vue";

defineOptions({
  name: "CraftComponentFlexContainer",
});

const props = defineProps({
  direction: {
    type: String,
    default: "column",
    validator: (value: string) =>
      ["row", "row-reverse", "column", "column-reverse"].includes(value),
  },
  justifyContent: {
    type: String,
    default: "center",
    validator: (value: string) =>
      [
        "flex-start",
        "flex-end",
        "center",
        "space-between",
        "space-around",
        "space-evenly",
      ].includes(value),
  },
  alignItems: {
    type: String,
    default: "center",
    validator: (value: string) =>
      ["flex-start", "flex-end", "center", "stretch", "baseline"].includes(
        value
      ),
  },
  wrap: {
    type: String,
    default: "nowrap",
    validator: (value: string) =>
      ["nowrap", "wrap", "wrap-reverse"].includes(value),
  },
});

const containerStyle = computed(
  (): CSSProperties => ({
    flexDirection: props.direction as CSSProperties["flexDirection"],
    justifyContent: props.justifyContent as CSSProperties["justifyContent"],
    alignItems: props.alignItems as CSSProperties["alignItems"],
    flexWrap: props.wrap as CSSProperties["flexWrap"],
  })
);
</script>

<style lang="scss" scoped>
.flex-container {
  display: flex;
  height: 100%;
  width: 100%;
}
</style>
