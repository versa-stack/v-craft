<template>
  <div class="w-full mb-10">
    <label for="editorEnabled">Preview Content: </label>
    <input
      id="editorEnabled"
      type="checkbox"
      name="editorEnabled"
      v-model="previewContent"
    />
  </div>
  <CraftEditor :config="config">
    <CraftCanvas component="CraftComponentSimpleContainer" />
  </CraftEditor>
</template>
<script lang="ts" setup>
import { CraftEditorConfig, useEditor } from "@versa-stack/v-craft";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";
import { onBeforeMount, ref, watch } from "vue";

const editor = useEditor()();

onBeforeMount(() => {
  if (!editor.hasNodes) {
    editor.setNodes([
      {
        componentName: "CraftCanvas",
        props: {
          component: "CraftComponentSimpleContainer",
        },
        children: [
          {
            label: "Text",
            componentName: "CraftComponentSimpleText",
            props: {
              content: "@versa-stack/v-craft",
              componentName: "h1",
            },
            children: [],
            uuid: "29780b04-d063-4eea-b397-3e1443589d7e",
            parentUuid: "d634ccb7-6b55-4787-80b2-2e922c9cb798",
          },
          {
            label: "Text",
            componentName: "CraftComponentSimpleText",
            props: {
              content: "hide",
              componentName: "p",
            },
            children: [],
            uuid: "07a03a93-269d-4539-bf47-05487ab7ed3b",
            parentUuid: "d634ccb7-6b55-4787-80b2-2e922c9cb798",
            events: {
              click:
                'const container = ctx.editor.nodeMap.get("bd5a073e-41b0-4781-99cb-6825ebdb5a2c");\n\nctx.editor.toggleNodeVisibility(container);\n\ncraftNode.props.content = container.visible === undefined || container.visible === true ? "hide" : "show";',
            },
          },
          {
            label: "Container with Text",
            componentName: "CraftCanvas",
            props: {
              component: "CraftComponentSimpleContainer",
            },
            children: [
              {
                componentName: "CraftComponentSimpleText",
                props: {
                  content:
                    "This content can be hidden with the CraftComponentSimpleText above. It used the onClick event to hide and show the CraftComponentSimpleContainer of this text.",
                  componentName: "blockquote",
                },
                uuid: "c0e03a34-b46b-466b-b607-820e5571bf7e",
                parentUuid: "bd5a073e-41b0-4781-99cb-6825ebdb5a2c",
                children: [],
              },
            ],
            uuid: "bd5a073e-41b0-4781-99cb-6825ebdb5a2c",
            parentUuid: "d634ccb7-6b55-4787-80b2-2e922c9cb798",
            visible: true,
          },
        ],
        parentUuid: null,
        uuid: "d634ccb7-6b55-4787-80b2-2e922c9cb798",
        visible: true,
      },
    ]);
  }
});

const previewContent = ref(false);

if (!previewContent.value) {
  editor.enable();
}

watch(
  () => previewContent.value,
  (disabled) => {
    if (!disabled) {
      editor.enable();
    }

    if (disabled) {
      editor.disable();
    }
  }
);

const config: CraftEditorConfig = {
  blueprintsLibrary,
  resolverMap,
};
</script>
