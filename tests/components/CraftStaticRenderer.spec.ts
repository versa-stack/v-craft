import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { h, defineComponent, nextTick } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import { CraftNodeResolverMap } from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";

const TestComponent = defineComponent({
  name: "TestComponent",
  props: {
    text: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () => h("div", { class: "test-component" }, [props.text, slots.default?.()]);
  },
});

const TestContainer = defineComponent({
  name: "TestContainer",
  setup(_, { slots }) {
    return () => h("section", { class: "test-container" }, slots.default?.());
  },
});

describe("CraftStaticRenderer", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const resolverMap: CraftNodeResolverMap<any> = {
    TestComponent: {
      componentName: "TestComponent",
      defaultProps: { text: "default" },
    },
    TestContainer: {
      componentName: "TestContainer",
    },
    CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
    CraftCanvas: defaultResolvers.CraftCanvas,
  };

  const createWrapper = (nodes: CraftNode[]) => {
    return mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolverMap,
      },
      global: {
        components: {
          TestComponent,
          TestContainer,
          CraftStaticRenderer,
          CraftNodeViewer,
          CraftComponentSimpleText,
          CraftCanvas,
        },
      },
    });
  };

  it("renders a single node", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Hello" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.find(".test-component").exists()).toBe(true);
    expect(wrapper.text()).toContain("Hello");
  });

  it("renders multiple nodes", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "First" },
        slots: {},
      },
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Second" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    const components = wrapper.findAll(".test-component");
    expect(components).toHaveLength(2);
    expect(wrapper.text()).toContain("First");
    expect(wrapper.text()).toContain("Second");
  });

  it("renders nested children", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestContainer",
        props: {},
        slots: {
          default: [
            {
              uuid: uuidv4(),
              componentName: "TestComponent",
              props: { text: "Nested" },
              slots: {},
            },
          ],
        },
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.find(".test-container").exists()).toBe(true);
    expect(wrapper.find(".test-container .test-component").exists()).toBe(true);
    expect(wrapper.text()).toContain("Nested");
  });

  it("applies default props from resolver", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "CraftComponentSimpleText",
        props: { componentName: "span" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()).toBe(true);
  });

  it("overrides default props with node props", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "override" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.text()).toContain("override");
    expect(wrapper.text()).not.toContain("default");
  });

  it("renders empty when nodes array is empty", () => {
    const wrapper = createWrapper([]);
    expect(wrapper.html()).toBe("");
  });

  it("respects node visibility", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Visible" },
        slots: {},
        visible: true,
      },
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Hidden" },
        slots: {},
        visible: false,
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.text()).toContain("Visible");
    expect(wrapper.text()).not.toContain("Hidden");
  });

  it("renders CraftNodeViewer for each node", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "First" },
        slots: {},
      },
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Second" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.findAllComponents({ name: "CraftNodeViewer" })).toHaveLength(2);
  });

  it("provides resolver to child components", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "CraftCanvas",
        props: { componentName: "div" },
        slots: {
          default: [
            {
              uuid: uuidv4(),
              componentName: "CraftComponentSimpleText",
              props: { content: "Canvas Child", componentName: "span" },
              slots: {},
            },
          ],
        },
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.findComponent({ name: "CraftCanvas" }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()).toBe(true);
    expect(wrapper.text()).toContain("Canvas Child");
  });

  it("renders deeply nested node tree", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestContainer",
        props: {},
        slots: {
          default: [
            {
              uuid: uuidv4(),
              componentName: "TestContainer",
              props: {},
              slots: {
                default: [
                  {
                    uuid: uuidv4(),
                    componentName: "TestComponent",
                    props: { text: "Deep" },
                    slots: {},
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.findAll(".test-container")).toHaveLength(2);
    expect(wrapper.find(".test-container .test-container .test-component").exists()).toBe(true);
    expect(wrapper.text()).toContain("Deep");
  });

  it("updates when nodes prop changes", async () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Initial" },
        slots: {},
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.text()).toContain("Initial");

    await wrapper.setProps({
      nodes: [
        {
          uuid: uuidv4(),
          componentName: "TestComponent",
          props: { text: "Updated" },
          slots: {},
        },
      ],
    });

    await nextTick();
    expect(wrapper.text()).toContain("Updated");
  });

  it("renders CraftCanvas with nested children without resolver warning", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "CraftCanvas",
        props: { componentName: "div" },
        slots: {
          default: [
            {
              uuid: uuidv4(),
              componentName: "CraftCanvas",
              props: { componentName: "header" },
              slots: {
                default: [
                  {
                    uuid: uuidv4(),
                    componentName: "CraftComponentSimpleText",
                    props: { content: "Home", componentName: "h1" },
                    slots: {},
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.findAllComponents({ name: "CraftCanvas" })).toHaveLength(2);
    expect(wrapper.find("header").exists()).toBe(true);
    expect(wrapper.text()).toContain("Home");
  });

  it("generates complete HTML for SSR with full component tree", async () => {
    const nodes: CraftNode[] = [
      {
        uuid: "root",
        componentName: "CraftCanvas",
        props: { componentName: "div", class: "container" },
        slots: {
          default: [
            {
              uuid: "header",
              componentName: "CraftCanvas",
              props: { componentName: "header", class: "bg-black" },
              slots: {
                default: [
                  {
                    uuid: "nav",
                    componentName: "CraftCanvas",
                    props: { componentName: "nav" },
                    slots: {
                      default: [
                        {
                          uuid: "title",
                          componentName: "CraftComponentSimpleText",
                          props: { content: "Site Title", componentName: "h1" },
                          slots: {},
                        },
                      ],
                    },
                  },
                ],
              },
            },
            {
              uuid: "main",
              componentName: "CraftCanvas",
              props: { componentName: "main" },
              slots: {
                default: [
                  {
                    uuid: "section",
                    componentName: "CraftCanvas",
                    props: { componentName: "section" },
                    slots: {
                      default: [
                        {
                          uuid: "article",
                          componentName: "CraftCanvas",
                          props: { componentName: "article" },
                          slots: {
                            default: [
                              {
                                uuid: "paragraph",
                                componentName: "CraftComponentSimpleText",
                                props: { content: "Article content here", componentName: "p" },
                                slots: {},
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
              uuid: "footer",
              componentName: "CraftCanvas",
              props: { componentName: "footer" },
              slots: {
                default: [
                  {
                    uuid: "copyright",
                    componentName: "CraftComponentSimpleText",
                    props: { content: "© 2025", componentName: "span" },
                    slots: {},
                  },
                ],
              },
            },
          ],
        },
      },
    ];

    const wrapper = createWrapper(nodes);
    const html = wrapper.html();

    expect(html).toContain('<div class="container">');
    expect(html).toContain('<header class="bg-black">');
    expect(html).toContain("<nav>");
    expect(html).toContain("<main>");
    expect(html).toContain("<section>");
    expect(html).toContain("<article>");
    expect(html).toContain("<footer>");

    expect(wrapper.find("div.container > header.bg-black > nav > h1").exists()).toBe(true);
    expect(wrapper.find("div.container > header.bg-black > nav > h1").text()).toBe("Site Title");
    expect(wrapper.find("div.container > main > section > article > p").exists()).toBe(true);
    expect(wrapper.find("div.container > main > section > article > p").text()).toBe("Article content here");
    expect(wrapper.find("div.container > footer > span").exists()).toBe(true);
    expect(wrapper.find("div.container > footer > span").text()).toBe("© 2025");
  });
});
