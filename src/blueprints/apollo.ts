export const apolloBlueprints = {
  metadata: {
    name: "apollo",
  },
  label: "Apollo GraphQL",
  blueprints: {
    CraftGraphqlProvider: {
      label: "Graphql Provider",
      componentName: "CraftCanvas",
      props: {
        componentName: "CraftGraphqlProvider",
        endpoint: "https://countries.trevorblades.com/graphql",
      },
      children: [],
    },
    CraftGraphqlQueryWrapper: {
      label: "Graphql Query Wrapper",
      componentName: "CraftCanvas",
      props: {
        componentName: "CraftGraphqlQueryWrapper",
        variables: "",
        map: {
          type: "list",
          fromPath: "$.countries[*]",
          patches: [
            {
              fromPath: "$.emoji",
              toPath: "$.content",
              type: "single",
            },
            {
              fromPath: "$.props.componentName",
              toPath: "$.componentName",
              patchSource: "child",
              default: "span",
              type: "single",
            },
          ],
        },
        query: `query GetCountries {
  countries {
    code
    emoji
  }
}`,
      },
      children: [],
    },
  },
};
