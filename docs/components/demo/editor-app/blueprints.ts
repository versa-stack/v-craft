import { Blueprints, CraftNode } from "@faasaf/v-craft";

export const blueprints: Blueprints = {
  CraftComponentSimpleContainer: {
    label: "Simple Container",
    componentName: "CraftCanvas",
    props: { component: "CraftComponentSimpleContainer" },
    children: [] as CraftNode[],
  },
  CraftComponentSimpleText: {
    label: "Text",
    componentName: "CraftComponentSimpleText",
    props: {
      content: "Change me.",
      tagName: "p",
    },
    children: [] as CraftNode[],
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
    children: [] as CraftNode[],
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
            type: "single"
          },
          {
            fromPath: "$.props.tagName",
            toPath: "$.tagName",
            patchSource: "child",
            default: "span",
            type: "single"
          }
        ]
      },
      query: `query GetCountries {
  countries {
    code
    emoji
  }
}`,
    },
    children: [] as CraftNode[],
  },
};
