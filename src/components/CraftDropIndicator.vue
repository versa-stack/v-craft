<template>
  <div
    v-if="indicator.isShown"
    class="fvc-indicator"
    :class="{ 'fvc-forbidden': indicator.isForbidden }"
    :style="getIndicatorStyle()"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { useIndicator } from "../store/indicator";
export default defineComponent({
  name: "CraftDropIndicator",
});
</script>
<script lang="ts" setup>
const indicator = useIndicator();

const getIndicatorStyle = () => {
  const { top, left } = indicator.position;
  const { width, height } = indicator.size;

  const style = {
    top: `${top}px`,
    left: `${left}px`,
    height: `${height}px`,
    width: `${width}px`,
  };

  return style;
};
</script>

<style lang="scss" scoped>
@import "../assets/dropIndicator";
</style>