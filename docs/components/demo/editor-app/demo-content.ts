import { CraftNode } from "@versa-stack/v-craft";
import { v4 as uuidv4 } from "uuid";

const process = (nodes: CraftNode[], parentUuid: string = "") => {
  return nodes.map((node) => {
    if (!node) {
      throw new Error("Node is undefined");
    }
    node.uuid = uuidv4();
    if (parentUuid) {
      node.parentUuid = parentUuid;
    }
    node.slots &&
      (Object.entries(node.slots) as [string, CraftNode[]][])
        .filter(([_, children]) => (children?.length ?? 0) > 0)
        .forEach(([slotName, children]) => {
          node.slots[slotName] = process(children, node.uuid);
        });

    return node;
  });
};

export const demoContent: CraftNode[] = process([
  {
    componentName: "CraftCanvas",
    props: {
      componentName: "div",
    },

    slots: {
      default: [
        {
          componentName: "CraftCanvas",
          props: {
            componentName: "CraftContainerExample",
          },
          slots: {
            header: [
              {
                label: "Text",
                componentName: "CraftComponentSimpleText",
                props: {
                  content: "Lorem ipsum dolor sit amet,",
                  componentName: "h1",
                },
              },
            ],
            body: [
              {
                label: "Text",
                componentName: "CraftComponentSimpleText",
                props: {
                  content:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras ut turpis justo. Curabitur id dapibus justo. Donec quis condimentum nulla. Sed in lectus nisi. Nullam sit amet neque erat. Integer metus turpis, vestibulum ut leo ac, tincidunt mollis nulla. Ut eu nisl id sapien eleifend dapibus id fringilla neque. Vivamus dapibus quam at diam mollis, eget eleifend sem laoreet.",
                  componentName: "p",
                },
              },
              {
                label: "Text",
                componentName: "CraftComponentSimpleText",
                props: {
                  content:
                    "Fusce et placerat lacus. Aenean at eros tempus, congue erat vel, blandit tellus. Etiam eu ex quis nunc semper varius. Morbi feugiat viverra eros. Nulla ut nisi dolor. Maecenas eget lectus quis justo sodales sodales. Vestibulum consequat tincidunt lorem eu consequat. Proin nunc lorem, tristique in mattis sed, imperdiet id ex. Quisque vulputate risus ac rhoncus viverra. Ut at felis eu sapien dictum dapibus.",
                  componentName: "p",
                },
              },
              {
                label: "Text",
                componentName: "CraftComponentSimpleText",
                props: {
                  content:
                    "Suspendisse ultrices mi est, in gravida mi laoreet sit amet. Aenean dapibus nulla ut placerat scelerisque. Maecenas venenatis vitae elit at vestibulum. Nunc vitae pharetra tortor. Ut augue felis, suscipit sed nisl sit amet, feugiat tincidunt massa. Nunc risus nulla, finibus nec sodales ut, condimentum id leo. Nam placerat eu purus vel aliquet. Mauris sollicitudin ligula malesuada lectus luctus, id consectetur odio hendrerit.",
                  componentName: "p",
                },
              },
              {
                label: "HTML <ul>",
                componentName: "CraftCanvas",
                props: {
                  componentName: "ul",
                },
                slots: {
                  default: [
                    {
                      label: "HTML <li>",
                      componentName: "CraftCanvas",
                      props: {
                        componentName: "li",
                      },
                      slots: {
                        default: [
                          {
                            label: "Text",
                            componentName: "CraftComponentSimpleText",
                            props: {
                              content:
                                "Aenean luctus arcu eu justo cursus faucibus. Phasellus non ex ac massa aliquet suscipit non eget odio.",
                              componentName: "span",
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },

        {
          label: "HTML <footer>",
          componentName: "CraftCanvas",
          props: {
            componentName: "footer",
          },
        },
      ],
    },
  },
]);
