<template>
  <div
    v-if="indicator.isShown"
    class="fvc-indicator"
    :class="{ 'fvc-forbidden': indicator.isForbidden }"
    :style="getIndicatorStyle()"
  />
</template>

<script lang="ts" setup>
import { useIndicator } from "../store/indicator";

const indicator = useIndicator();

const getIndicatorStyle = () => {
  const { top, left } = indicator.position;
  const { width, height } = indicator.size;

  return {
    top: `${top}px`,
    left: `${left}px`,
    height: `${height}px`,
    width: `${width}px`,
  };
};
</script>

<style lang="scss">
@import "../assets/dropIndicator";
</style>
