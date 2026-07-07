import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { h, defineComponent, nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeStatic from "../../src/components/CraftNodeStatic.vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { writeFileSync } from "fs";

const TestComponent = defineComponent({
  name: "TestComponent",
  props: {
    text: { type: String, default: "" },
  },
  setup(props, { slots }) {
    return () =>
      h("div", { class: "test-component" }, [props.text, slots.default?.()]);
  },
});

const TestContainer = defineComponent({
  name: "TestContainer",
  setup(_, { slots }) {
    return () => h("section", { class: "test-container" }, slots.default?.());
  },
});

const ResolverComponent = defineComponent({
  name: "ResolverComponent",
  template: `<div class="resolver-component">resolver component</div>`,
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
          CraftNodeStatic,
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
    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists(),
    ).toBe(true);
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

  it("renders CraftNodeStatic for each node", () => {
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

    writeFileSync("hello.txt", wrapper.html());
    expect(wrapper.findAllComponents({ name: "CraftNodeStatic" })).toHaveLength(
      2,
    );
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
    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists(),
    ).toBe(true);
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
    expect(
      wrapper.find(".test-container .test-container .test-component").exists(),
    ).toBe(true);
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
                                props: {
                                  content: "Article content here",
                                  componentName: "p",
                                },
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

    expect(
      wrapper.find("div.container > header.bg-black > nav > h1").exists(),
    ).toBe(true);
    expect(
      wrapper.find("div.container > header.bg-black > nav > h1").text(),
    ).toBe("Site Title");
    expect(
      wrapper.find("div.container > main > section > article > p").exists(),
    ).toBe(true);
    expect(
      wrapper.find("div.container > main > section > article > p").text(),
    ).toBe("Article content here");
    expect(wrapper.find("div.container > footer > span").exists()).toBe(true);
    expect(wrapper.find("div.container > footer > span").text()).toBe("© 2025");
  });

  it("uses provided resolver instance from props", () => {
    const resolver = new CraftNodeResolver({
      TestComponent: {
        componentName: "TestComponent",
        component: TestComponent,
      },
    } as CraftNodeResolverMap<any>);

    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Hello" },
        slots: {},
      },
    ];

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolver,
      },
      global: {
        components: {
          TestComponent,
          CraftStaticRenderer,
          CraftNodeStatic,
        },
      },
    });

    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(".test-component").exists()).toBe(true);
  });

  it("creates new resolver from resolverMap when resolver not provided", () => {
    const testResolverMap: CraftNodeResolverMap<any> = {
      TestComponent: {
        componentName: "TestComponent",
        component: TestComponent,
      },
    };

    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Hello" },
        slots: {},
      },
    ];

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolverMap: testResolverMap,
      },
      global: {
        components: {
          TestComponent,
          CraftStaticRenderer,
          CraftNodeStatic,
        },
      },
    });

    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(".test-component").exists()).toBe(true);
  });

  it("preserves resolver hooks when using provided resolver instance", () => {
    const hookCalled = ref(false);

    const resolver = new CraftNodeResolver({
      ResolverComponent: {
        componentName: "ResolverComponent",
        component: ResolverComponent,
      },
    } as CraftNodeResolverMap<any>);

    resolver.onResolveComponent((craftNode, defaultResolver) => {
      hookCalled.value = true;
      if (craftNode.componentName === "ResolverComponent") {
        return ResolverComponent;
      }
      return defaultResolver(craftNode.componentName);
    });

    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "ResolverComponent",
        props: {},
        slots: {},
      },
    ];

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolver,
      },
      global: {
        components: {
          ResolverComponent,
          CraftStaticRenderer,
          CraftNodeStatic,
        },
      },
    });

    expect(wrapper.vm).toBeTruthy();

    const testNode: CraftNode = {
      uuid: uuidv4(),
      componentName: "ResolverComponent",
      props: {},
      slots: {},
    };

    const resolved = resolver.resolveComponent(testNode);
    expect(resolved).toBe(ResolverComponent);
    expect(hookCalled.value).toBe(true);
  });

  it("prioritizes resolver instance over resolverMap when both provided", () => {
    const instanceResolver = new CraftNodeResolver({
      TestComponent: {
        componentName: "TestComponent",
        component: TestComponent,
      },
    } as CraftNodeResolverMap<any>);

    const mapResolver: CraftNodeResolverMap<any> = {
      ResolverComponent: {
        componentName: "ResolverComponent",
        component: ResolverComponent,
      },
    };

    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Hello" },
        slots: {},
      },
    ];

    const wrapper = mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolver: instanceResolver,
        resolverMap: mapResolver,
      },
      global: {
        components: {
          TestComponent,
          CraftStaticRenderer,
          CraftNodeStatic,
        },
      },
    });

    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.find(".test-component").exists()).toBe(true);
  });

  describe("runtime event ctx (nodeValues, setNodeProps, state, getNode)", () => {
    const runtimeResolverMap: CraftNodeResolverMap<any> = {
      ...resolverMap,
      input: { componentName: "input" },
    };

    const createRuntimeWrapper = (nodes: CraftNode[]) =>
      mount(CraftStaticRenderer, {
        props: { nodes, resolverMap: runtimeResolverMap },
        global: {
          components: {
            TestComponent,
            CraftStaticRenderer,
            CraftNodeStatic,
            CraftComponentSimpleText,
            CraftCanvas,
          },
        },
      });

    it("captures a native input's typed value and exposes it to another node's click handler via ctx.nodeValues", async () => {
      const inputUuid = uuidv4();
      const outputUuid = uuidv4();
      const triggerUuid = uuidv4();

      const nodes: CraftNode[] = [
        { uuid: inputUuid, componentName: "input", props: {}, slots: {} },
        {
          uuid: outputUuid,
          componentName: "TestComponent",
          props: { text: "before" },
          slots: {},
        },
        {
          uuid: triggerUuid,
          componentName: "TestComponent",
          props: { text: "trigger" },
          slots: {},
          events: {
            click: `ctx.setNodeProps("${outputUuid}", { text: ctx.nodeValues["${inputUuid}"]?.value ?? "" })`,
          },
        },
      ];

      const wrapper = createRuntimeWrapper(nodes);
      await wrapper.find("input").setValue("typed value");
      await wrapper.findAll(".test-component")[1].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".test-component")[0].text()).toBe("typed value");
    });

    it("getNode resolves a node by uuid (regression: Map lookup via bracket access always returned undefined)", async () => {
      const targetUuid = uuidv4();
      const triggerUuid = uuidv4();

      const nodes: CraftNode[] = [
        {
          uuid: targetUuid,
          componentName: "TestComponent",
          props: { text: "before" },
          slots: {},
        },
        {
          uuid: triggerUuid,
          componentName: "TestComponent",
          props: { text: "trigger" },
          slots: {},
          events: {
            click: `ctx.setNodeProps("${targetUuid}", { text: ctx.getNode("${targetUuid}") ? "found" : "missing" })`,
          },
        },
      ];

      const wrapper = createRuntimeWrapper(nodes);
      await wrapper.findAll(".test-component")[1].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".test-component")[0].text()).toBe("found");
    });

    it("shares ctx.state across event handlers on different nodes", async () => {
      const counterUuid = uuidv4();
      const firstUuid = uuidv4();
      const secondUuid = uuidv4();

      const nodes: CraftNode[] = [
        {
          uuid: counterUuid,
          componentName: "TestComponent",
          props: { text: "0" },
          slots: {},
        },
        {
          uuid: firstUuid,
          componentName: "TestComponent",
          props: { text: "first" },
          slots: {},
          events: {
            click: `ctx.state.count = (ctx.state.count || 0) + 1; ctx.setNodeProps("${counterUuid}", { text: String(ctx.state.count) })`,
          },
        },
        {
          uuid: secondUuid,
          componentName: "TestComponent",
          props: { text: "second" },
          slots: {},
          events: {
            click: `ctx.state.count = (ctx.state.count || 0) + 1; ctx.setNodeProps("${counterUuid}", { text: String(ctx.state.count) })`,
          },
        },
      ];

      const wrapper = createRuntimeWrapper(nodes);
      await wrapper.findAll(".test-component")[1].trigger("click");
      await wrapper.findAll(".test-component")[2].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".test-component")[0].text()).toBe("2");
    });

    it("gives nodeRuntimeProps precedence over the node's own authored props", async () => {
      const targetUuid = uuidv4();
      const triggerUuid = uuidv4();

      const nodes: CraftNode[] = [
        {
          uuid: targetUuid,
          componentName: "TestComponent",
          props: { text: "authored" },
          slots: {},
        },
        {
          uuid: triggerUuid,
          componentName: "TestComponent",
          props: { text: "trigger" },
          slots: {},
          events: {
            click: `ctx.setNodeProps("${targetUuid}", { text: "overridden" })`,
          },
        },
      ];

      const wrapper = createRuntimeWrapper(nodes);
      expect(wrapper.findAll(".test-component")[0].text()).toBe("authored");

      await wrapper.findAll(".test-component")[1].trigger("click");
      await nextTick();

      expect(wrapper.findAll(".test-component")[0].text()).toBe("overridden");
    });
  });
});
