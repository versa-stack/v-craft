export default [
  {
    $formkit: "text",
    name: "width",
    label: "Width",
    placeholder: "e.g., 100px, 50%",
    help: "Set the width of the container",
  },
  {
    $formkit: "text",
    name: "height",
    label: "Height",
    placeholder: "e.g., 100px, auto",
    help: "Set the height of the container",
  },
  {
    $formkit: "text",
    name: "minWidth",
    label: "Min Width",
    placeholder: "e.g., 100px",
  },
  {
    $formkit: "text",
    name: "maxWidth",
    label: "Max Width",
    placeholder: "e.g., 500px",
  },
  {
    $formkit: "text",
    name: "minHeight",
    label: "Min Height",
    placeholder: "e.g., 50px",
  },
  {
    $formkit: "text",
    name: "maxHeight",
    label: "Max Height",
    placeholder: "e.g., 300px",
  },
  {
    $formkit: "text",
    name: "margin",
    label: "Margin",
    placeholder: "e.g., 10px or 10px 20px",
    help: "Set margin for all sides or individual sides",
  },
  {
    $formkit: "text",
    name: "padding",
    label: "Padding",
    placeholder: "e.g., 10px or 10px 20px",
    help: "Set padding for all sides or individual sides",
  },
  {
    $formkit: "text",
    name: "border",
    label: "Border",
    placeholder: "e.g., 1px solid black",
    help: "Set border style, width, and color",
  },
  {
    $formkit: "select",
    name: "position",
    label: "Position",
    options: ["static", "relative", "absolute", "fixed", "sticky"],
    help: "Set the positioning method",
  },
  {
    $formkit: "text",
    name: "top",
    label: "Top",
    placeholder: "e.g., 10px",
  },
  {
    $formkit: "text",
    name: "right",
    label: "Right",
    placeholder: "e.g., 10px",
  },
  {
    $formkit: "text",
    name: "bottom",
    label: "Bottom",
    placeholder: "e.g., 10px",
  },
  {
    $formkit: "text",
    name: "left",
    label: "Left",
    placeholder: "e.g., 10px",
  },
  {
    $formkit: "text",
    name: "zIndex",
    label: "Z-Index",
    placeholder: "e.g., 1, 10, 100",
    help: "Set the stacking order",
  },
  {
    $formkit: "select",
    name: "display",
    label: "Display",
    options: ["block", "inline", "inline-block", "none"],
    help: "Set how the element is displayed",
  },
  {
    $formkit: "select",
    name: "overflow",
    label: "Overflow",
    options: ["visible", "hidden", "scroll", "auto"],
    help: "Set how overflow content is handled",
  },
];
