<template>
  <CraftEditorPanelLayout :blueprints="config.blueprintsLibrary">
    <template
      v-if="$slots['panel-layout']"
      #panel-layout="{ blueprints, deselectNodes }"
    >
      <slot
        name="panel-layout"
        :blueprints="blueprints"
        :deselectNodes="deselectNodes"
      />
    </template>
    <template v-else #default>
      <CraftFrame
        :useIframe="useIframe"
        :inheritStyles="inheritStyles"
        :iFrameStyleSheets="iFrameStyleSheets"
        :iFrameClass="iFrameClass"
        :resolverMap="config.resolverMap"
        @iframe-load="(iframe) => emit('iframeLoad', iframe)"
      >
        <slot />
      </CraftFrame>
    </template>
  </CraftEditorPanelLayout>
</template>

<script lang="ts" setup generic="T extends object">
import { storeToRefs } from "pinia";
import { HTMLAttributes, provide, ref, watch } from "vue";
import { type CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { CraftEditorConfig } from "../lib/model";
import { useEditor } from "../store/editor";

const props = withDefaults(
  defineProps<{
    config: CraftEditorConfig<T>;
    useIframe?: boolean;
    iFrameStyleSheets?: string[];
    iFrameClass?: HTMLAttributes["class"];
    inheritStyles?: boolean;
  }>(),
  {
    useIframe: false,
    inheritStyles: false,
    iFrameClass: "",
    iFrameStyleSheets: () => [],
  },
);

const emit = defineEmits<{
  (e: "nodeDragStart", n: CraftNode): void;
  (e: "nodeDragEnd"): void;
  (e: "iframeLoad", iframe: HTMLIFrameElement): void;
}>();

const editor = useEditor();

const { getDraggedNode } = storeToRefs(editor);

watch(getDraggedNode, (node) => {
  if (node) {
    emit("nodeDragStart", node);
    return;
  }
  emit("nodeDragEnd");
});

const resolver = ref(new CraftNodeResolver(props.config.resolverMap));
provide("resolver", resolver);
</script>
