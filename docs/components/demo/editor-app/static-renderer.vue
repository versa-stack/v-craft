<template>
  <div class="content">
    <CraftStaticRenderer :nodes="sampleNodes" :resolverMap="resolverMap" />
  </div>
</template>
<script lang="ts" setup>
import { CraftStaticRenderer, CraftNode } from "@versa-stack/v-craft";
import { resolverMap } from "./resolvermap";

const sampleNodes: CraftNode[] = [
  {
    uuid: "static-1",
    componentName: "CraftComponentSimpleText",
    props: {
      content: "This content is rendered using CraftStaticRenderer",
      componentName: "h2",
    },
    children: [],
  },
  {
    uuid: "static-2",
    componentName: "CraftComponentSimpleText",
    props: {
      content: "It works without Pinia and is fully SSR compatible.",
      componentName: "p",
    },
    children: [],
  },
];
</script>
