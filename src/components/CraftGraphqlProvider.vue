<template>
    <div>
        <slot></slot>
    </div>
</template>
<script lang="ts">
export default {
  name: "CraftGraphqlProvider",
};
</script>
<script setup lang="ts">
import { provideApolloClient } from '@vue/apollo-composable';
import { createApolloClient } from '../apollo/client';
import { ref, watch } from 'vue';

const props = defineProps({
  endpoint: {
    type: String,
    required: true,
  },
});

const apolloClient = ref(createApolloClient(props.endpoint));

watch(() => props.endpoint, (newUri) => {
  apolloClient.value = createApolloClient(newUri);
});

provideApolloClient(apolloClient.value as any);
</script>
