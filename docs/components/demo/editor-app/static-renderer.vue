<template>
  <div class="content">
    <CraftStaticRenderer
      :nodes="demoContent"
      :resolver-map="resolverMap"
    />
  </div>
</template>
<script lang="ts" setup>
import { CraftStaticRenderer } from "@versa-stack/v-craft";
import { resolverMap } from "./resolvermap";
import { demoContent } from "./demo-content";
</script>
