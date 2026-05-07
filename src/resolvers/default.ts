export const defaultResolvers = {
  CraftComponentSimpleText: {
    componentName: "CraftComponentSimpleText",
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
      {
        $formkit: "text",
        label: "Class",
        name: "class",
      },
    ],
  },
  CraftCanvas: {
    componentName: "CraftCanvas",
  },
};
