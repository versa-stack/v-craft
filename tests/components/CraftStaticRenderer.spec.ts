import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { h, defineComponent } from "vue";
import CraftStaticRenderer from "../../src/components/CraftStaticRenderer.vue";
import { CraftNode, CraftNodeDatasource } from "../../src/lib/craftNode";
import { CraftNodeResolverMap } from "../../src/lib/CraftNodeResolver";

const TestComponent = defineComponent({
  name: "TestComponent",
  props: {
    text: { type: String, default: "" },
  },
  emits: ["click"],
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

const ClickableComponent = defineComponent({
  name: "ClickableComponent",
  emits: ["click"],
  setup(_, { emit }) {
    return () => h("button", { class: "clickable", onClick: () => emit("click") }, "Click me");
  },
});

describe("CraftStaticRenderer", () => {
  const resolverMap: CraftNodeResolverMap<any> = {
    TestComponent: {
      componentName: "TestComponent",
      defaultProps: { text: "default" },
    },
    TestContainer: {
      componentName: "TestContainer",
    },
    ClickableComponent: {
      componentName: "ClickableComponent",
    },
  };

  const createWrapper = (
    nodes: CraftNode[],
    options: {
      nodeDataMap?: Record<string, CraftNodeDatasource | null>;
      eventsContext?: Record<string, any>;
    } = {}
  ) => {
    return mount(CraftStaticRenderer, {
      props: {
        nodes,
        resolverMap,
        ...options,
      },
      global: {
        components: {
          TestComponent,
          TestContainer,
          ClickableComponent,
          CraftStaticRenderer,
        },
      },
    });
  };

  it("renders a single node", () => {
    const nodes: CraftNode[] = [
      {
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "Hello" },
        children: [],
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.find(".test-component").exists()).toBe(true);
    expect(wrapper.text()).toContain("Hello");
  });

  it("renders multiple nodes", () => {
    const nodes: CraftNode[] = [
      {
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "First" },
        children: [],
      },
      {
        uuid: "2",
        componentName: "TestComponent",
        props: { text: "Second" },
        children: [],
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
        uuid: "1",
        componentName: "TestContainer",
        props: {},
        children: [
          {
            uuid: "2",
            componentName: "TestComponent",
            props: { text: "Nested" },
            children: [],
          },
        ],
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
        uuid: "1",
        componentName: "TestComponent",
        props: {},
        children: [],
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.text()).toContain("default");
  });

  it("overrides default props with node props", () => {
    const nodes: CraftNode[] = [
      {
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "override" },
        children: [],
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
        uuid: "1",
        componentName: "TestComponent",
        props: { text: "Visible" },
        children: [],
        visible: true,
      },
      {
        uuid: "2",
        componentName: "TestComponent",
        props: { text: "Hidden" },
        children: [],
        visible: false,
      },
    ];

    const wrapper = createWrapper(nodes);
    expect(wrapper.text()).toContain("Visible");
    expect(wrapper.text()).not.toContain("Hidden");
  });

  it("executes event handlers from events context", async () => {
    const clickHandler = vi.fn();
    const nodes: CraftNode[] = [
      {
        uuid: "1",
        componentName: "ClickableComponent",
        props: {},
        children: [],
        events: {
          click: "ctx.onClick()",
        },
      },
    ];

    const wrapper = createWrapper(nodes, {
      eventsContext: { onClick: clickHandler },
    });

    await wrapper.find(".clickable").trigger("click");
    expect(clickHandler).toHaveBeenCalled();
  });

  it("renders data source with single type", () => {
    const nodes: CraftNode[] = [
      {
        uuid: "parent",
        componentName: "TestContainer",
        props: {},
        children: [
          {
            uuid: "child",
            componentName: "TestComponent",
            props: { text: "base" },
            children: [],
          },
        ],
      },
    ];

    const nodeDataMap: Record<string, CraftNodeDatasource> = {
      parent: {
        type: "single",
        item: { text: "from-data" },
      },
    };

    const wrapper = createWrapper(nodes, { nodeDataMap });
    expect(wrapper.text()).toContain("from-data");
  });

  it("renders data source with list type", () => {
    const nodes: CraftNode[] = [
      {
        uuid: "parent",
        componentName: "TestContainer",
        props: {},
        children: [
          {
            uuid: "child",
            componentName: "TestComponent",
            props: {},
            children: [],
          },
        ],
      },
    ];

    const nodeDataMap: Record<string, CraftNodeDatasource> = {
      parent: {
        type: "list",
        list: [{ text: "Item 1" }, { text: "Item 2" }, { text: "Item 3" }],
      },
    };

    const wrapper = createWrapper(nodes, { nodeDataMap });
    expect(wrapper.text()).toContain("Item 1");
    expect(wrapper.text()).toContain("Item 2");
    expect(wrapper.text()).toContain("Item 3");
  });
});
