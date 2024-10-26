import { CraftNode, CraftNodeResolver } from "../index";
import boxModelContainerSchema from "./property-schema/CraftComponentBoxModelContainer";
import flexContainerSchema from "./property-schema/CraftComponentFlexContainer";

export const defaultResolvers = {
  CraftComponentSimpleText: {
    componentName: "CraftComponentSimpleText",
    eventsSchema: {
      $el: "div",
      children: [
        {
          $formkit: "textarea",
          name: "click",
          label: "onClick"
        }
      ]
    },
    propsSchema: [
      {
        $formkit: "select",
        label: "Type",
        name: "componentName",
        options: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "span",
          "div",
          "blockquote",
        ],
      },
      {
        $formkit: "textarea",
        label: "Content",
        name: "content",
      },
    ],
  },
  CraftComponentBoxModelContainer: {
    componentName: "CraftComponentBoxModelContainer",
    propsSchema: boxModelContainerSchema,
  },
  CraftComponentSimpleContainer: {
    componentName: "CraftComponentSimpleContainer",
  },
  CraftComponentFlexContainer: {
    componentName: "CraftComponentFlexContainer",
    propsSchema: flexContainerSchema,
  },
  CraftCanvas: {
    componentName: "CraftCanvas",
  },
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
        targetNode: CraftNode<T>,
        resolver: CraftNodeResolver<T>
      ) {
        if (
          craftNode.componentName === defaultResolvers.CraftCanvas.componentName
        ) {
          craftNode = resolver.resolve(
            craftNode.props.component
          ) as CraftNode<T>;
        }

        return (
          craftNode.componentName ===
          defaultResolvers.CraftGraphqlQueryWrapper.componentName
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
        craftNode: CraftNode<T>,
        targetNode: CraftNode<T>,
        resolver: CraftNodeResolver<T>
      ) {
        if (
          targetNode.componentName ===
          defaultResolvers.CraftCanvas.componentName
        ) {
          targetNode = resolver.resolve(
            targetNode.props.component
          ) as CraftNode<T>;
        }

        return (
          targetNode.componentName ===
          defaultResolvers.CraftGraphqlProvider.componentName
        );
      },
      canMoveIn<T extends object>(
        craftNode: CraftNode<T>,
        targetNode: CraftNode<T>
      ) {
        return targetNode.children.length < 1;
      },
    },
  },
};
