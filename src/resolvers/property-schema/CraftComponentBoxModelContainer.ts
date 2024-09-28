export default [
  {
    $el: "fieldset",
    children: [
      {
        $el: "legend",
        children: "Dimensions",
      },
      {
        $formkit: "text",
        name: "width",
        label: "Width",
        placeholder: "e.g., 100px, 50%, auto",
      },
      {
        $formkit: "text",
        name: "height",
        label: "Height",
        placeholder: "e.g., 100px, auto",
      },
      {
        $formkit: "text",
        name: "minWidth",
        label: "Min Width",
        placeholder: "e.g., 100px, auto",
      },
      {
        $formkit: "text",
        name: "maxWidth",
        label: "Max Width",
        placeholder: "e.g., 500px, none",
      },
      {
        $formkit: "text",
        name: "minHeight",
        label: "Min Height",
        placeholder: "e.g., 50px, auto",
      },
      {
        $formkit: "text",
        name: "maxHeight",
        label: "Max Height",
        placeholder: "e.g., 300px, none",
      },
    ],
  },
  {
    $el: "fieldset",
    children: [
      {
        $el: "legend",
        children: "Spacing",
      },
      {
        $formkit: "text",
        name: "margin",
        label: "Margin",
        placeholder: "e.g., 10px or 10px 20px",
      },
      {
        $formkit: "text",
        name: "padding",
        label: "Padding",
        placeholder: "e.g., 10px or 10px 20px",
      },
    ],
  },
  {
    $formkit: "text",
    name: "border",
    label: "Border",
    placeholder: "e.g., 1px solid black",
  },
  {
    $el: "fieldset",
    children: [
      {
        $el: "legend",
        children: "Positioning",
      },
      {
        $formkit: "select",
        name: "position",
        label: "Position",
        options: ["static", "relative", "absolute", "fixed", "sticky"],
        value: "relative"
      },
      {
        $formkit: "text",
        name: "top",
        label: "Top",
        placeholder: "e.g., 10px, auto",
      },
      {
        $formkit: "text",
        name: "right",
        label: "Right",
        placeholder: "e.g., 10px, auto",
      },
      {
        $formkit: "text",
        name: "bottom",
        label: "Bottom",
        placeholder: "e.g., 10px, auto",
      },
      {
        $formkit: "text",
        name: "left",
        label: "Left",
        placeholder: "e.g., 10px, auto",
      },
      {
        $formkit: "text",
        name: "zIndex",
        label: "Z-Index",
        placeholder: "e.g., 1, 10, auto",
      },
    ],
  },
  {
    $formkit: "select",
    name: "display",
    label: "Display",
    options: ["block", "inline", "inline-block", "none"],
  },
  {
    $formkit: "select",
    name: "overflow",
    label: "Overflow",
    options: ["visible", "hidden", "scroll", "auto"],
  },
];
