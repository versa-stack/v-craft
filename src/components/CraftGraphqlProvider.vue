<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { provideApolloClient } from "@vue/apollo-composable";
import { createApolloClient } from "../apollo/client";

defineOptions({
  name: "CraftGraphqlProvider",
});

const props = defineProps<{
  endpoint: string;
}>();

const apolloClient = ref<any | null>(null);

const initApolloClient = (uri: string) => {
  apolloClient.value = createApolloClient(uri);
  if (apolloClient.value) {
    provideApolloClient(apolloClient.value);
  }
};

initApolloClient(props.endpoint);

watch(
  () => props.endpoint,
  (newUri) => {
    initApolloClient(newUri);
  }
);
</script>
