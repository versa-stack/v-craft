import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { h, defineComponent, nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeStatic from "../../src/components/CraftNodeStatic.vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import { CraftNode, CraftNodeDatasource } from "../../src/lib/craftNode";
import type { CraftNodeEventsDispatch, CraftNodeEventsRuntime } from "../../src/components/composable/useCraftNodeEvents";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";

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

  describe("event dispatch to the host (no content code)", () => {
    const runtimeResolverMap: CraftNodeResolverMap<any> = {
      ...resolverMap,
      input: { componentName: "input" },
    };
    const components = { TestComponent, CraftStaticRenderer, CraftNodeStatic, CraftComponentSimpleText, CraftCanvas };

    type Handler = (rt: CraftNodeEventsRuntime, data: unknown) => unknown;
    const hostDispatch = (handlers: Record<string, Handler>): CraftNodeEventsDispatch =>
      (node, _event, _args, data, rt) => handlers[node.uuid]?.(rt, data);

    const createRuntimeWrapper = (
      nodes: CraftNode[],
      dispatch: CraftNodeEventsDispatch,
      nodeDataMap?: Record<string, CraftNodeDatasource>,
    ) =>
      mount(CraftStaticRenderer, {
        props: { nodes, resolverMap: runtimeResolverMap, eventsContext: { dispatch }, nodeDataMap },
        global: { components },
      });

    const click = [{ on: "click" }];

    it("never evaluates a legacy events string", async () => {
      const nodes: CraftNode[] = [
        { uuid: uuidv4(), componentName: "TestComponent", props: { text: "x" }, slots: {}, events: { click: "globalThis.pwned=1" } } as CraftNode,
      ];
      const wrapper = createRuntimeWrapper(nodes, vi.fn());
      await wrapper.find(".test-component").trigger("click");
      expect((globalThis as Record<string, unknown>).pwned).toBeUndefined();
    });

    it("calls dispatch once with (node, eventName, args, boundData)", async () => {
      const wrapperUuid = uuidv4();
      const childUuid = uuidv4();
      const dispatch = vi.fn();
      const nodes: CraftNode[] = [
        {
          uuid: wrapperUuid,
          componentName: "CraftCanvas",
          props: { componentName: "div" },
          slots: { default: [{ uuid: childUuid, componentName: "TestComponent", props: { text: "t" }, slots: {}, interactions: click }] },
        },
      ];
      const wrapper = createRuntimeWrapper(nodes, dispatch, { [wrapperUuid]: { type: "single", item: { id: "v42" } } });
      await wrapper.find(".test-component").trigger("click");
      expect(dispatch).toHaveBeenCalledTimes(1);
      const [node, eventName, args, data] = dispatch.mock.calls[0];
      expect(node.uuid).toContain(childUuid);
      expect(eventName).toBe("click");
      expect(args[0]).toBeInstanceOf(Event);
      expect(data).toEqual({ id: "v42" });
    });

    it("ignores repeat fires and sets aria-busy while a dispatch is pending", async () => {
      let resolve!: () => void;
      const dispatch = vi.fn(() => new Promise<void>((r) => (resolve = r)));
      const nodes: CraftNode[] = [
        { uuid: uuidv4(), componentName: "TestComponent", props: { text: "t" }, slots: {}, interactions: click },
      ];
      const wrapper = createRuntimeWrapper(nodes, dispatch);
      const el = wrapper.find(".test-component");
      await el.trigger("click");
      expect(el.attributes("aria-busy")).toBe("true");
      await el.trigger("click");
      expect(dispatch).toHaveBeenCalledTimes(1);
      resolve();
      await flushPromises();
      expect(el.attributes("aria-busy")).toBeUndefined();
      await el.trigger("click");
      expect(dispatch).toHaveBeenCalledTimes(2);
    });

    it("binds nothing for a node without interactions", async () => {
      const dispatch = vi.fn();
      const nodes: CraftNode[] = [{ uuid: uuidv4(), componentName: "TestComponent", props: { text: "t" }, slots: {} }];
      const wrapper = createRuntimeWrapper(nodes, dispatch);
      await wrapper.find(".test-component").trigger("click");
      expect(dispatch).not.toHaveBeenCalled();
    });

    it("hands the host a captured input value via nodeValues", async () => {
      const inputUuid = uuidv4();
      const outputUuid = uuidv4();
      const triggerUuid = uuidv4();
      const nodes: CraftNode[] = [
        { uuid: inputUuid, componentName: "input", props: {}, slots: {} },
        { uuid: outputUuid, componentName: "TestComponent", props: { text: "before" }, slots: {} },
        { uuid: triggerUuid, componentName: "TestComponent", props: { text: "trigger" }, slots: {}, interactions: click },
      ];
      const wrapper = createRuntimeWrapper(nodes, hostDispatch({
        [triggerUuid]: (rt) => rt.setNodeProps?.(outputUuid, { text: rt.nodeValues?.[inputUuid]?.value ?? "" }),
      }));
      await wrapper.find("input").setValue("typed value");
      await wrapper.findAll(".test-component")[1].trigger("click");
      await nextTick();
      expect(wrapper.findAll(".test-component")[0].text()).toBe("typed value");
    });

    it("setSelfProps patches only the clicked instance of a list-rendered node", async () => {
      const wrapperUuid = uuidv4();
      const childUuid = uuidv4();
      const nodes: CraftNode[] = [
        {
          uuid: wrapperUuid,
          componentName: "CraftCanvas",
          props: { componentName: "div" },
          slots: { default: [{ uuid: childUuid, componentName: "TestComponent", props: { text: "idle" }, slots: {}, interactions: click }] },
        },
      ];
      const dispatch: CraftNodeEventsDispatch = (_n, _e, _a, data, rt) =>
        rt.setSelfProps?.({ text: "busy " + (data as { id: string }).id });
      const wrapper = createRuntimeWrapper(nodes, dispatch, { [wrapperUuid]: { type: "list", list: [{ id: "a" }, { id: "b" }] } });
      await wrapper.findAll(".test-component")[1].trigger("click");
      await nextTick();
      expect(wrapper.findAll(".test-component").map((c) => c.text())).toEqual(["idle", "busy b"]);
    });

    it("never binds a captured value back onto list siblings sharing the uuid", async () => {
      const wrapperUuid = uuidv4();
      const nodes: CraftNode[] = [
        {
          uuid: wrapperUuid,
          componentName: "CraftCanvas",
          props: { componentName: "div" },
          slots: { default: [{ uuid: uuidv4(), componentName: "input", props: {}, slots: {} }] },
        },
      ];
      const wrapper = createRuntimeWrapper(nodes, vi.fn(), { [wrapperUuid]: { type: "list", list: [{ id: "a" }, { id: "b" }] } });
      const inputs = wrapper.findAll("input");
      await inputs[0].setValue("typed");
      await nextTick();
      expect(inputs[1].attributes("value")).toBeUndefined();
      expect((inputs[1].element as HTMLInputElement).value).toBe("");
    });

    it("getNode resolves a node by uuid and state is shared across nodes", async () => {
      const targetUuid = uuidv4();
      const firstUuid = uuidv4();
      const secondUuid = uuidv4();
      const bump: Handler = (rt) => {
        rt.state!.count = (rt.state!.count || 0) + 1;
        rt.setNodeProps?.(targetUuid, { text: `${rt.getNode?.(targetUuid) ? "found" : "missing"} ${rt.state!.count}` });
      };
      const nodes: CraftNode[] = [
        { uuid: targetUuid, componentName: "TestComponent", props: { text: "authored" }, slots: {} },
        { uuid: firstUuid, componentName: "TestComponent", props: { text: "first" }, slots: {}, interactions: click },
        { uuid: secondUuid, componentName: "TestComponent", props: { text: "second" }, slots: {}, interactions: click },
      ];
      const wrapper = createRuntimeWrapper(nodes, hostDispatch({ [firstUuid]: bump, [secondUuid]: bump }));
      expect(wrapper.findAll(".test-component")[0].text()).toBe("authored");
      await wrapper.findAll(".test-component")[1].trigger("click");
      await wrapper.findAll(".test-component")[2].trigger("click");
      await nextTick();
      expect(wrapper.findAll(".test-component")[0].text()).toBe("found 2");
    });
  });
});
