<template>
  <div>
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ (error as any).message }}</p>
    <div v-else>
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "CraftGraphqlQueryWrapper",
};
</script>

<script setup lang="ts">
import { ApolloError } from "@apollo/client";
import { useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import jp from "jsonpath";
import { ComputedRef, inject, onMounted, ref, useSlots, watch } from "vue";
import {
  CraftGraphqlQueryWrapperData,
  CraftGraphqlQueryWrapperPatch,
  CraftGraphqlQueryWrapperPropMap,
} from "../lib/model";
import { CraftNode } from "../lib/craftNode";
import { useEditor } from "../store/editor";

const props = defineProps({
  query: {
    type: String,
    required: true,
  },
  variables: {
    type: Object,
    default: () => ({}),
  },
  map: {
    type: Object,
    default: () => ({} as CraftGraphqlQueryWrapperPropMap),
  },
});

const result = ref<null | any>(null);
const loading = ref(true);
const error = ref<null | unknown | ApolloError>(null);
const craftNode = inject<ComputedRef<CraftNode>>("craftNode");

const editor = useEditor();
const output = ref<CraftGraphqlQueryWrapperData>({
  type: "single",
  item: {},
  list: [],
});

const setupQuery = (query: string) => {
  const { onResult, onError } = useQuery(gql(query), props.variables);

  onResult((queryResult) => {
    result.value = queryResult.data;
    loading.value = false;
  });

  onError((queryError) => {
    error.value = queryError;
    loading.value = false;
    console.error("GraphQL Query Error:", queryError);
  });
};

try {
  setupQuery(props.query);
} catch (e) {
  console.error("Error setting up GraphQL query:", e);
  error.value = e;
  loading.value = false;
}

watch(
  () => props.query,
  () => {
    try {
      setupQuery(props.query);
    } catch (e) {
      console.error("Error setting up GraphQL query:", e);
      error.value = e;
      loading.value = false;
    }
  }
);

watch(
  () => [output.value],
  () => {
    if (!craftNode?.value) {
      return;
    }

    craftNode.value.data = output.value;
    editor.setNode(craftNode.value);
  }
);

watch(
  () => [props.map, result.value],
  ([map, resultValue]) => {
    if (!resultValue) {
      resultValue = result.value;
    }

    if (!(map.path || map?.patches) || !resultValue) {
      output.value = {
        type: "single",
        item: resultValue,
        list: [],
      };
      return;
    }

    const rootNode = queryItemOrList(map, resultValue);

    output.value = {
      type: map.type,
      item: map.type === "single" ? {} : undefined,
      list: map.type === "list" ? [] : undefined,
    };

    if (!map.patches) {
      if (map.type === "single") {
        output.value.item = rootNode;
      } else {
        output.value.list = rootNode;
      }
      return;
    }

    map.patches.forEach((patch: CraftGraphqlQueryWrapperPatch) => {
      if (map.type === "single" && output.value.item) {
        setValueAtPath(
          output.value.item,
          patch.toPath,
          queryItemOrList(patch, rootNode)
        );
      }

      if (map.type === "list" && output.value.list && rootNode.length > 0) {
        rootNode.forEach((item: any, key: number) => {
          if (!output.value.list![key]) {
            output.value.list![key] = {};
          }
          setValueAtPath(
            output.value.list![key],
            patch.toPath,
            queryItemOrList(patch, item)
          );
        });
      }
    });
  }
);

const slots = useSlots();

const fetchFirstChildInSlot = () => {
  const defaultSlot = slots.default?.();
  if (!defaultSlot || defaultSlot.length === 0) return {};

  const firstChild = defaultSlot[0]?.children;
  if (!firstChild || firstChild.length === 0) return {};
  const firstGrandChild = firstChild[0]?.children[0];

  return firstGrandChild?.props?.craftNode ?? {};
};

const childRef = ref(fetchFirstChildInSlot());

watch(
  () => craftNode?.value,
  () => {
    childRef.value = fetchFirstChildInSlot();
  }
);

const getPatchSource = (
  source: "mapPathResult" | "value" | "child",
  item: any,
  patch: CraftGraphqlQueryWrapperPatch
) => {
  if (source === "mapPathResult") {
    return item;
  }

  if (source === "value") {
    return patch.value;
  }

  if (source == "child") {
    return childRef.value;
  }

  return {};
};

const queryResultOrDefault = (
  patch: CraftGraphqlQueryWrapperPatch,
  result: any
) => result || patch.default || null;

const queryItemOrList = (patch: CraftGraphqlQueryWrapperPatch, item: any) => {
  const source = getPatchSource(
    patch.patchSource ?? "mapPathResult",
    item,
    patch
  );

  if (typeof source === "object" && patch.fromPath) {
    const result = jp.query(source, patch.fromPath);

    if (result && patch.type === "single") {
      return queryResultOrDefault(patch, result[0]);
    }

    return queryResultOrDefault(patch, result);
  }

  return queryResultOrDefault(patch, source);
};

const setValueAtPath = (obj: Record<string, any>, path: string, value: any) => {
  const pathComponents = jp.parse(path);
  let current = obj;

  for (let i = 0; i < pathComponents.length - 1; i++) {
    const component = pathComponents[i];
    if (component.expression.type === "identifier") {
      if (!(component.expression.value in current)) {
        current[component.expression.value] = {};
      }
      current = current[component.expression.value];
    } else if (component.expression.type === "index") {
      if (!Array.isArray(current)) {
        throw new Error("Cannot set an index on a non-array object");
      }
      const index = parseInt(component.expression.value, 10);
      if (isNaN(index)) {
        throw new Error("Invalid array index");
      }
      if (index >= current.length) {
        current.length = index + 1;
      }
      if (typeof current[index] !== "object" || current[index] === null) {
        current[index] = {};
      }
      current = current[index];
    }
  }

  const lastComponent = pathComponents[pathComponents.length - 1];
  if (lastComponent.expression.type === "identifier") {
    current[lastComponent.expression.value] = value;
  } else if (lastComponent.expression.type === "index") {
    if (!Array.isArray(current)) {
      throw new Error("Cannot set an index on a non-array object");
    }
    const index = parseInt(lastComponent.expression.value, 10);
    if (isNaN(index)) {
      throw new Error("Invalid array index");
    }
    current[index] = value;
  }
};
</script>
