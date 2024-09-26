export const defaultBlueprints = {
  metadata: {
    name: "default",
  },
  label: "Default",
  blueprints: {
    CraftComponentBoxModelContainer: {
      label: "Box Model Container",
      componentName: "CraftCanvas",
      props: { component: "CraftComponentBoxModelContainer" },
      children: [],
    },
    CraftComponentSimpleContainer: {
      label: "Simple Container",
      componentName: "CraftCanvas",
      props: { component: "CraftComponentSimpleContainer" },
      children: [],
    },
    CraftComponentFlexContainer: {
      label: "Flex Container",
      componentName: "CraftCanvas",
      props: {
        component: "CraftComponentFlexContainer",
        direction: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        wrap: "nowrap",
      },
      children: [],
    },
    CraftComponentSimpleText: {
      label: "Text",
      componentName: "CraftComponentSimpleText",
      props: {
        content: "Change me.",
        tagName: "p",
      },
      children: [],
    },
    ContainerWithTextBlueprint: {
      label: "Container with Text",
      componentName: "CraftCanvas",
      props: {
        component: "CraftComponentSimpleContainer",
      },
      children: [
        {
          componentName: "CraftComponentSimpleText",
          props: {
            content: "Some prefilled text.",
            tagName: "h1",
          },
        },
      ],
    },
    CraftGraphqlProvider: {
      label: "Graphql Provider",
      componentName: "CraftCanvas",
      props: {
        component: "CraftGraphqlProvider",
        endpoint: "https://countries.trevorblades.com/graphql",
      },
      children: [],
    },
    CraftGraphqlQueryWrapper: {
      label: "Graphql Query Wrapper",
      componentName: "CraftCanvas",
      props: {
        component: "CraftGraphqlQueryWrapper",
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
              fromPath: "$.props.tagName",
              toPath: "$.tagName",
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
