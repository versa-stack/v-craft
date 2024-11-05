import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { defaultResolvers } from "./default";

export const apolloResolvers = {
  CraftGraphqlProvider: {
    componentName: "CraftGraphqlProvider",
    propsSchema: [
      {
        $formkit: "text",
        label: "Endpoint",
        name: "endpoint",
      },
    ],
    rules: {
      canMoveIn<T extends object>(
        craftNode: CraftNode<T>,
        _targetNode: CraftNode<T>,
        resolver: CraftNodeResolver<T>
      ) {
        if (
          craftNode.componentName === defaultResolvers.CraftCanvas.componentName
        ) {
          craftNode = resolver.resolve(
            craftNode.props.componentName
          ) as CraftNode<T>;
        }

        return (
          craftNode.componentName ===
          apolloResolvers.CraftGraphqlQueryWrapper.componentName
        );
      },
    },
  },
  CraftGraphqlQueryWrapper: {
    componentName: "CraftGraphqlQueryWrapper",
    propsSchema: [
      {
        $formkit: "graphql",
        name: "query",
        label: "Query",
        validation: "required",
      },
      {
        $formkit: "graphql",
        name: "variables",
        label: "Variables",
      },
      {
        $formkit: "group",
        name: "map",
        label: "Map",
        children: [
          {
            $formkit: "text",
            name: "fromPath",
            label: "From Path",
            validation: "required",
          },
          {
            $formkit: "select",
            name: "type",
            label: "Map Type",
            options: [
              { label: "Single", value: "single" },
              { label: "List", value: "list" },
            ],
            validation: "required",
          },
          {
            $formkit: "patches",
            name: "patches",
            label: "Patches",
          },
        ],
      },
    ],
    rules: {
      canMoveInto<T extends object>(
        _craftNode: CraftNode<T>,
        targetNode: CraftNode<T>,
        resolver: CraftNodeResolver<T>
      ) {
        if (
          targetNode.componentName ===
          defaultResolvers.CraftCanvas.componentName
        ) {
          targetNode = resolver.resolve(
            targetNode.props.componentName
          ) as CraftNode<T>;
        }

        return (
          targetNode.componentName ===
          apolloResolvers.CraftGraphqlProvider.componentName
        );
      },
      canMoveIn<T extends object>(
        _craftNode: CraftNode<T>,
        targetNode: CraftNode<T>
      ) {
        return targetNode.children.length < 1;
      },
    },
  },
};
