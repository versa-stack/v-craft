import {
  CraftNodeResolverMap,
  defaultResolvers,
  apolloResolvers,
} from "@versa-stack/v-craft";

const resolveHtmlElements = (elements: string[]) => {
  const mapped: Record<string, any> = {};

  elements.forEach((element) => {
    mapped[element] = {
      componentName: element,
      eventsSchema: {
        $el: "div",
        children: [
          {
            $formkit: "textarea",
            name: "click",
            label: "onClick",
          },
        ],
      },
      propsSchema: [
        {
          $formkit: "text",
          label: "CSS Class(es)",
          name: "class",
        },
      ],
    };
  });
  return mapped;
};

export const htmlResolvers = {
  ...resolveHtmlElements([
    "article",
    "aside",
    "details",
    "div",
    "figure",
    "footer",
    "header",
    "li",
    "main",
    "nav",
    "ol",
    "section",
    "ul",
  ]),
};

export const resolverMap: CraftNodeResolverMap = {
  ...defaultResolvers,
  ...apolloResolvers,
  ...htmlResolvers,
};
