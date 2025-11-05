<template>
  <CraftEditor :config="config">
    <template #panel-layout="{ blueprints }">
      <CraftEditorBlueprintsList :blueprints="blueprints">
        <template #blueprint-group="{ group, resolver }">
          <h4 class="mb-2">{{ group.label }}</h4>
          <div class="flex gap-3">
            <CraftEditorBlueprint
              v-for="(craftNode, key) in Utils.blueprintsWithDefaults(
                group,
                resolver
              )"
              :craftNode="craftNode"
              :key="key"
            >
              <div class="v-craft-blueprint">
                <div class="v-craft-blueprint-label">
                  {{ craftNode.label }}
                </div>
              </div>
            </CraftEditorBlueprint>
          </div>
        </template>
      </CraftEditorBlueprintsList>
      <hr />
      <CraftFrame>
        <slot />
      </CraftFrame>
      <hr />
      <CraftEditorPanelSettings>
        <template
          #panel-content="{
            schema,
            selectedNode,
            handlePropsUpdate,
            eventsSchema,
            handleEventsUpdate,
            deleteable,
            removeNode,
          }"
        >
          <div class="flex justify-around">
            <div v-if="schema" class="w-auto">
              <CraftEditorPanelNodeSettings
                :craftNode="selectedNode"
                :schema="schema"
                @update:props="handlePropsUpdate"
              />
            </div>
            <div v-if="eventsSchema" class="w-auto">
              <CraftEditorPanelNodeEventsSettings
                :craftNode="selectedNode"
                :schema="eventsSchema"
                @update:events="handleEventsUpdate"
              />
            </div>
            <div class="w-auto" data-type="button">
              <button
                class="formkit-input v-craft-delete"
                v-if="deleteable"
                @click.prevent="removeNode"
              >
                Delete
              </button>
            </div>
          </div>
        </template>
      </CraftEditorPanelSettings>
    </template>
  </CraftEditor>
  <div class="editor-switch">
    <label for="editorEnabled">Preview Content: </label>
    <input
      id="editorEnabled"
      type="checkbox"
      name="editorEnabled"
      v-model="previewContent"
    />
    <div class="text-sm">(disables editor drag and drop)</div>
  </div>
</template>
<script lang="ts" setup>
import { CraftEditorConfig, useEditor, Utils } from "@versa-stack/v-craft";
import { onBeforeMount, ref, watch } from "vue";
import blueprintsLibrary from "./blueprints";
import { resolverMap } from "./resolvermap";

const editor = useEditor();

onBeforeMount(() => {
  if (!editor.hasNodes) {
    editor.setNodes([
      {
        componentName: "CraftCanvas",
        props: {
          componentName: "div",
        },
        children: [
          {
            label: "HTML <header>",
            componentName: "CraftCanvas",
            props: {
              componentName: "header",
            },
            children: [
              {
                label: "Text",
                componentName: "CraftComponentSimpleText",
                props: {
                  content: "Lorem ipsum dolor sit amet,",
                  componentName: "h1",
                },
                children: [],
                uuid: "eafd2ed2-9e86-44b9-9ea7-b7cd0649f237",
                parentUuid: "9544c8fd-aacc-4143-9d9e-0dae9d84074f",
              },
            ],
            uuid: "9544c8fd-aacc-4143-9d9e-0dae9d84074f",
            parentUuid: "f0e246b7-73df-4fcb-bf37-b7df25e50e14",
          },
          {
            label: "HTML <main>",
            componentName: "CraftCanvas",
            props: {
              componentName: "main",
            },
            children: [
              {
                label: "HTML <section>",
                componentName: "CraftCanvas",
                props: {
                  componentName: "section",
                },
                children: [
                  {
                    label: "HTML <article>",
                    componentName: "CraftCanvas",
                    props: {
                      componentName: "article",
                      class: "",
                    },
                    children: [
                      {
                        label: "Text",
                        componentName: "CraftComponentSimpleText",
                        props: {
                          content:
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut turpis justo. Curabitur id dapibus justo. Donec quis condimentum nulla. Sed in lectus nisi. Nullam sit amet neque erat. Integer metus turpis, vestibulum ut leo ac, tincidunt mollis nulla. Ut eu nisl id sapien eleifend dapibus id fringilla neque. Vivamus dapibus quam at diam mollis, eget eleifend sem laoreet.",
                          componentName: "p",
                        },
                        children: [],
                        uuid: "ab5ddb6e-2605-4bcd-b713-0d4f135e492e",
                        parentUuid: "e1b1fd9e-1195-4a03-81de-2d8bac88170d",
                      },
                      {
                        label: "Text",
                        componentName: "CraftComponentSimpleText",
                        props: {
                          content:
                            "Fusce et placerat lacus. Aenean at eros tempus, congue erat vel, blandit tellus. Etiam eu ex quis nunc semper varius. Morbi feugiat viverra eros. Nulla ut nisi dolor. Maecenas eget lectus quis justo sodales sodales. Vestibulum consequat tincidunt lorem eu consequat. Proin nunc lorem, tristique in mattis sed, imperdiet id ex. Quisque vulputate risus ac rhoncus viverra. Ut at felis eu sapien dictum dapibus.",
                          componentName: "p",
                        },
                        children: [],
                        uuid: "44b654ef-bf54-43ac-a9dd-976f5204bdbb",
                        parentUuid: "e1b1fd9e-1195-4a03-81de-2d8bac88170d",
                      },
                      {
                        label: "Text",
                        componentName: "CraftComponentSimpleText",
                        props: {
                          content:
                            "Suspendisse ultrices mi est, in gravida mi laoreet sit amet. Aenean dapibus nulla ut placerat scelerisque. Maecenas venenatis vitae elit at vestibulum. Nunc vitae pharetra tortor. Ut augue felis, suscipit sed nisl sit amet, feugiat tincidunt massa. Nunc risus nulla, finibus nec sodales ut, condimentum id leo. Nam placerat eu purus vel aliquet. Mauris sollicitudin ligula malesuada lectus luctus, id consectetur odio hendrerit.",
                          componentName: "p",
                        },
                        children: [],
                        uuid: "46369c18-a6ac-4592-aec0-3ac471df963d",
                        parentUuid: "e1b1fd9e-1195-4a03-81de-2d8bac88170d",
                      },
                      {
                        label: "HTML <ul>",
                        componentName: "CraftCanvas",
                        props: {
                          componentName: "ul",
                        },
                        children: [
                          {
                            label: "HTML <li>",
                            componentName: "CraftCanvas",
                            props: {
                              componentName: "li",
                            },
                            children: [
                              {
                                label: "Text",
                                componentName: "CraftComponentSimpleText",
                                props: {
                                  content:
                                    "Aenean luctus arcu eu justo cursus faucibus. Phasellus non ex ac massa aliquet suscipit non eget odio.",
                                  componentName: "span",
                                },
                                children: [],
                                uuid: "dc1f9b0a-d5e6-41bd-84cb-7581200da453",
                                parentUuid:
                                  "e6e65cef-3478-420e-923f-70243cc052b1",
                              },
                            ],
                            uuid: "e6e65cef-3478-420e-923f-70243cc052b1",
                            parentUuid: "364a3066-dd08-48ed-bc08-992d5a167414",
                          },
                        ],
                        uuid: "364a3066-dd08-48ed-bc08-992d5a167414",
                        parentUuid: "e1b1fd9e-1195-4a03-81de-2d8bac88170d",
                      },
                    ],
                    uuid: "e1b1fd9e-1195-4a03-81de-2d8bac88170d",
                    parentUuid: "6404a1d8-3078-478e-91b7-e5609153a3ea",
                  },
                ],
                uuid: "6404a1d8-3078-478e-91b7-e5609153a3ea",
                parentUuid: "61258907-a77d-4c6b-bda9-845f6973ebf0",
              },
            ],
            uuid: "61258907-a77d-4c6b-bda9-845f6973ebf0",
            parentUuid: "f0e246b7-73df-4fcb-bf37-b7df25e50e14",
          },
          {
            label: "HTML <footer>",
            componentName: "CraftCanvas",
            props: {
              componentName: "footer",
            },
            children: [],
            uuid: "5f76c3b0-4af1-4979-9b22-cb8d2ef0bcc3",
            parentUuid: "f0e246b7-73df-4fcb-bf37-b7df25e50e14",
          },
        ],
        parentUuid: null,
        uuid: "f0e246b7-73df-4fcb-bf37-b7df25e50e14",
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
<style lang="scss" scoped>
.editor-switch {
  display: inline-block;
}

:deep(.v-craft-blueprint) {
  text-align: center;
  padding: 0.25em;
  position: relative;
  border: 1px solid var(--v-craft-gray-medium);
  border-radius: 3px;
  align-items: center;
  cursor: pointer;
  background-color: var(--v-craft-background-color-lighter-10);
}

:deep(.v-craft-blueprint-label) {
  font-size: 0.8em;
  text-transform: uppercase;
  font-weight: bold;
  color: var(--v-craft-gray-darker);
}
</style>
