import { ApolloClient } from "@apollo/client/core";
import { useApolloClient } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, ref, Ref, shallowRef } from "vue";
import { mapGraphqlData } from "../../lib/mapGraphqlData";
import {
  CraftGraphqlQueryWrapperData,
  CraftGraphqlQueryWrapperPropMap,
} from "../../lib/model";

export function useGraphqlQuery(
  query: Ref<string>,
  variables: Ref<string>,
  map: Ref<CraftGraphqlQueryWrapperPropMap>,
  childRef: Ref<any>
) {
  const apolloClient = useApolloClient().client as ApolloClient<any>;
  const rawData = shallowRef<any>(null);
  const error = shallowRef<Error | null>(null);
  const loading = ref(false);

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    let parsedVariables = {};
    if (variables.value) {
      try {
        parsedVariables = JSON.parse(variables.value);
      } catch {}
    }
    const cachedData = apolloClient.readQuery({
      query: gql(query.value),
      variables: parsedVariables,
    });

    if (cachedData) {
      rawData.value = cachedData;
    } else {
      const { data } = await apolloClient.query({
        query: gql(query.value),
        variables: parsedVariables,
      });
      rawData.value = data;
    }
  };

  const mappedData = computed<CraftGraphqlQueryWrapperData | null>(() => {
    if (!rawData.value) return null;
    return mapGraphqlData(rawData.value, map.value, childRef.value);
  });

  return {
    fetchData,
    mappedData,
    rawData,
    error,
    loading,
  };
}
