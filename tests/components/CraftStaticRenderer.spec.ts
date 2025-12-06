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
    div: {
      componentName: "div",
    },
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
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "First" },
        children: [],
      },
      {
        uuid: uuidv4(),
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
        uuid: uuidv4(),
        componentName: "TestContainer",
        props: {},
        children: [
          {
            uuid: uuidv4(),
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
        uuid: uuidv4(),
        componentName: "CraftComponentSimpleText",
        props: { componentName: "span" },
        children: [],
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
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Visible" },
        children: [],
        visible: true,
      },
      {
        uuid: uuidv4(),
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

  it("renders CraftNodeViewer for each node", () => {
    const nodes: CraftNode[] = [
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "First" },
        children: [],
      },
      {
        uuid: uuidv4(),
        componentName: "TestComponent",
        props: { text: "Second" },
        children: [],
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
        children: [
          {
            uuid: uuidv4(),
            componentName: "CraftComponentSimpleText",
            props: { content: "Canvas Child", componentName: "span" },
            children: [],
          },
        ],
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
        children: [
          {
            uuid: uuidv4(),
            componentName: "TestContainer",
            props: {},
            children: [
              {
                uuid: uuidv4(),
                componentName: "TestComponent",
                props: { text: "Deep" },
                children: [],
              },
            ],
          },
        ],
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
        children: [],
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
          children: [],
        },
      ],
    });

    await nextTick();
    expect(wrapper.text()).toContain("Updated");
  });
});
