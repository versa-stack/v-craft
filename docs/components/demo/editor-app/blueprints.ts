import { BlueprintsLibrary, defaultBlueprints } from "@versa-stack/v-craft";

export default {
  groups: [
    defaultBlueprints,
    {
      metadata: {
        name: "docs-example",
      },
      label: "Docs Examples",
      blueprints: {
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
                componentName: "h1",
              },
            },
          ],
        },
      },
    },
  ],
} as BlueprintsLibrary;
