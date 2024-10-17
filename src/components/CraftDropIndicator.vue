<template>
  <div
    v-if="indicator.isShown"
    class="v-craft-indicator"
    :class="{ 'v-craft-forbidden': indicator.isForbidden }"
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
:root {
  --v-craft-indicator-bg-allowed: var(--v-craft-green);
  --v-craft-indicator-bg-forbidden: var(--v-craft-red);
  --v-craft-indicator-transition-duration: 0.125s;
  --v-craft-indicator-z-index: 10000;
}
</style>
<style lang="scss" scoped>
.v-craft-indicator {
  position: fixed;
  background-color: var(--v-craft-indicator-bg-allowed);
  transition: top var(--v-craft-indicator-transition-duration) ease,
    left var(--v-craft-indicator-transition-duration) ease,
    right var(--v-craft-indicator-transition-duration) ease,
    bottom var(--v-craft-indicator-transition-duration) ease,
    width var(--v-craft-indicator-transition-duration) ease,
    height var(--v-craft-indicator-transition-duration) ease,
    background-color var(--v-craft-indicator-transition-duration) ease-in-out;

  z-index: var(--v-craft-indicator-z-index);

  &:after {
    content: " ";
  }

  &.v-craft-forbidden {
    background-color: var(--v-craft-indicator-bg-forbidden);
  }
}
</style>
