import { CraftNode, CraftNodeResolver } from "@versa-stack/v-craft";

export const resolverMap = {
  paragraph: {
    component: "CraftComponentSimpleText",
    propsSchema: [
      {
        $formkit: "select",
        label: "Type",
        name: "tagName",
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
  container: {
    component: "CraftComponentSimpleContainer",
  },
  canvas: {
    component: "CraftCanvas",
  },
  graphqlProvider: {
    component: "CraftGraphqlProvider",
    propsSchema: [
      {
        $formkit: "text",
        label: "Endpoint",
        name: "endpoint",
      },
    ],
    rules: {
      canMoveIn(
        craftNode: CraftNode,
        targetNode: CraftNode,
        resolver: CraftNodeResolver
      ) {
        if (craftNode.componentName === resolverMap.canvas.component) {
          craftNode = resolver.resolve(craftNode.props.component);
        }
        return (
          craftNode.component === resolverMap.graphqlQueryWrapper.component
        );
      },
    },
  },
  graphqlQueryWrapper: {
    component: "CraftGraphqlQueryWrapper",
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
        validation: "required",
      },
      {
        $formkit: "text",
        name: "map.fromPath",
        label: "From Path",
      },
      {
        $formkit: "select",
        name: "map.type",
        label: "Map Type",
        options: [
          { label: "Single", value: "single" },
          { label: "List", value: "list" },
        ],
        validation: "required",
      },
      {
        $formkit: "patches",
        name: "map.patches",
        label: "Patches",
      },
    ],
    rules: {
      canMoveInto(
        craftNode: CraftNode,
        targetNode: CraftNode,
        resolver: CraftNodeResolver
      ) {
        if (targetNode.componentName === resolverMap.canvas.component) {
          targetNode = resolver.resolve(targetNode.props.component);
        }

        return targetNode.component === resolverMap.graphqlProvider.component;
      },
      canMoveIn(craftNode: CraftNode, targetNode: CraftNode) {
        return targetNode.children < 1;
      },
    },
  },
};
