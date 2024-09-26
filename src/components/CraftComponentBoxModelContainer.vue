<template>
  <div class="box-model-container" :style="containerStyle">
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { computed, CSSProperties } from "vue";

const props = defineProps({
  margin: { type: String, default: "0px" },
  padding: { type: String, default: "0px" },
  border: { type: String, default: "none" },

  width: { type: String, default: "auto" },
  height: { type: String, default: "auto" },
  minWidth: { type: String, default: "auto" },
  minHeight: { type: String, default: "auto" },
  maxWidth: { type: String, default: "none" },
  maxHeight: { type: String, default: "none" },

  position: {
    type: String as () => CSSProperties["position"],
    default: "relative",
  },
  top: { type: String, default: "auto" },
  right: { type: String, default: "auto" },
  bottom: { type: String, default: "auto" },
  left: { type: String, default: "auto" },
  zIndex: { type: [Number, String], default: "auto" },

  display: { type: String as () => CSSProperties["display"], default: "block" },
  overflow: {
    type: String as () => CSSProperties["overflow"],
    default: "visible",
  },
});

const containerStyle = computed(
  (): CSSProperties => ({
    margin: props.margin,
    padding: props.padding,
    border: props.border,
    width: props.width,
    height: props.height,
    minWidth: props.minWidth,
    minHeight: props.minHeight,
    maxWidth: props.maxWidth,
    maxHeight: props.maxHeight,
    position: props.position,
    top: props.top,
    right: props.right,
    bottom: props.bottom,
    left: props.left,
    zIndex: props.zIndex,
    display: props.display,
    overflow: props.overflow,
  })
);
</script>

<style lang="scss" scoped>
.box-model-container {
  box-sizing: border-box;
}
</style>
