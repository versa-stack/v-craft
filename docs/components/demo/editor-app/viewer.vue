<template>
  <div class="content">
    <CraftFrame :viewOnly="true" :resolverMap="resolverMap" />
  </div>
</template>
<script lang="ts" setup>
import { useEditor } from "@versa-stack/v-craft";
import { resolverMap } from "./resolvermap";
const editor = useEditor()();
editor.disable();
</script>
