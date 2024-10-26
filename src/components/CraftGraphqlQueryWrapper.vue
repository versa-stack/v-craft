<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts" generic="T extends object">
import {
  computed,
  ComputedRef,
  inject,
  onMounted,
  shallowRef,
  toRef,
  useSlots,
  watch,
  watchEffect,
} from "vue";
import { CraftNode } from "../lib/craftNode";
import { CraftGraphqlQueryWrapperPropMap } from "../lib/model";
import { useEditor } from "../store/editor";
import { useGraphqlQuery } from "./composable/useGraphqlQuery";
import { isEqual } from "lodash-es";

defineOptions({
  name: "CraftGraphqlQueryWrapper",
});

const props = defineProps<{
  query: string;
  variables: string;
  map: CraftGraphqlQueryWrapperPropMap;
}>();

const craftNode = inject<ComputedRef<CraftNode<T>>>("craftNode");
const editor = useEditor<T>()();
const slots = useSlots();

const fetchFirstChildInSlot = computed(() => {
  const defaultSlot = slots.default?.();
  if (!defaultSlot || defaultSlot.length === 0) return {};

  const firstChild = defaultSlot[0]?.children;
  if (!firstChild || firstChild.length === 0 || !firstChild[0]?.children[0])
    return {};
  const firstGrandChild = firstChild[0]?.children[0];

  return firstGrandChild?.props?.craftNode ?? {};
});

const childRef = shallowRef(fetchFirstChildInSlot.value);

const { fetchData, mappedData } = useGraphqlQuery(
  toRef(props, "query"),
  toRef(props, "variables"),
  toRef(props, "map"),
  childRef
);

onMounted(fetchData);

watch(
  () => mappedData.value,
  (data) => {
    if (craftNode?.value) {
      if (!isEqual(data, editor.nodeDataMap[craftNode?.value.uuid])) {
        editor.setNodeData(craftNode.value.uuid, data);
      }
    }
  }
);

watchEffect(() => {
  childRef.value = fetchFirstChildInSlot.value;
});
</script>
