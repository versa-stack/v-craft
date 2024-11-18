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
      children: [],
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
  ],
} as BlueprintsLibrary;
