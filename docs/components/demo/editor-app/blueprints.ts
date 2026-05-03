import {
  Blueprints,
  BlueprintsLibrary,
  CraftNodeResolverMap,
  defaultBlueprints,
} from "@versa-stack/v-craft";
import { htmlResolvers } from "./resolvermap";

const createHtmlElementBlueprints = () => {
  const resolverMap: CraftNodeResolverMap<any> = htmlResolvers;
  const blueprints: Blueprints<any> = {};

  Object.entries(resolverMap).forEach(([key, value]) => {
    blueprints[key] = {
      label: `HTML <${value.componentName}>`,
      componentName: "CraftCanvas",
      props: {
        ...value.defaultProps,
        componentName: value.componentName,
      },
    };
  });

  return blueprints;
};

export default {
  groups: [
    defaultBlueprints,
    {
      metadata: {
        name: "html-elements",
      },
      label: "HTML Elements",
      blueprints: createHtmlElementBlueprints(),
    },
    {
      metadata: {
        name: "examples",
      },
      label: "Examples",
      blueprints: {
        CraftContainerExample: {
          label: "Container (2 Slots)",
          componentName: "CraftCanvas",
          props: {
            componentName: "CraftContainerExample",
          },
        },
        CraftContainerSingleSlot: {
          label: "Container (1 Slot)",
          componentName: "CraftCanvas",
          props: {
            componentName: "CraftContainerSingleSlot",
          },
        },
      },
    },
  ],
} as BlueprintsLibrary;
