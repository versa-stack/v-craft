import { mount, flushPromises } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";

const SyncComponent = defineComponent({
  name: "SyncComponent",
  template: `<div class="sync">sync</div>`,
});

const AsyncComponent = defineComponent({
  name: "AsyncComponent",
  template: `<div class="async">async</div>`,
});

const asyncFactory = () => Promise.resolve(AsyncComponent);

const mountCanvas = (componentName: string, resolver: CraftNodeResolver) => {
  return mount(CraftCanvas, {
    props: { componentName },
    global: {
      provide: { resolver: ref(resolver) },
      components: { SyncComponent, AsyncComponent },
    },
  });
};

describe("CraftCanvas", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders a sync component from the resolver", async () => {
    const resolver = new CraftNodeResolver({
      SyncComponent: { componentName: "SyncComponent", component: SyncComponent },
    });

    const wrapper = mountCanvas("SyncComponent", resolver);
    await flushPromises();

    expect(wrapper.find(".sync").exists()).toBe(true);
    expect(wrapper.text()).toBe("sync");
  });

  it("renders an async component from an async factory in the resolver", async () => {
    const resolver = new CraftNodeResolver({
      AsyncComponent: { componentName: "AsyncComponent", component: asyncFactory },
    });

    const wrapper = mountCanvas("AsyncComponent", resolver);
    await flushPromises();

    expect(wrapper.find(".async").exists()).toBe(true);
    expect(wrapper.text()).toBe("async");
  });

  it("falls back to the componentName string when no resolver entry exists", async () => {
    const resolver = new CraftNodeResolver({});

    const wrapper = mountCanvas("div", resolver);
    await flushPromises();

    expect(wrapper.find("div").exists()).toBe(true);
  });

  it("falls back to the componentName string when resolver has no component field", async () => {
    const resolver = new CraftNodeResolver({
      MyComponent: { componentName: "MyComponent" },
    });

    const wrapper = mountCanvas("MyComponent", resolver);
    await flushPromises();

    expect(wrapper.html()).toContain("mycomponent");
  });

  it("passes attrs to the resolved component", async () => {
    const resolver = new CraftNodeResolver({
      SyncComponent: { componentName: "SyncComponent", component: SyncComponent },
    });

    const wrapper = mount(CraftCanvas, {
      props: { componentName: "SyncComponent" },
      attrs: { "data-testid": "canvas-root" },
      global: {
        provide: { resolver: ref(resolver) },
        components: { SyncComponent },
      },
    });
    await flushPromises();

    expect(wrapper.find("[data-testid='canvas-root']").exists()).toBe(true);
  });

  it("forwards named slots to the resolved component", async () => {
    const WithSlot = defineComponent({
      name: "WithSlot",
      template: `<div><slot name="header" /><slot /></div>`,
    });

    const resolver = new CraftNodeResolver({
      WithSlot: { componentName: "WithSlot", component: WithSlot },
    });

    const wrapper = mount(CraftCanvas, {
      props: { componentName: "WithSlot" },
      slots: {
        header: `<span class="header-slot">header content</span>`,
        default: `<span class="default-slot">default content</span>`,
      },
      global: {
        provide: { resolver: ref(resolver) },
        components: { WithSlot },
      },
    });
    await flushPromises();

    expect(wrapper.find(".header-slot").exists()).toBe(true);
    expect(wrapper.find(".default-slot").exists()).toBe(true);
  });

  it("falls back to rendering the componentName as a tag when resolver is not provided", async () => {
    const wrapper = mount(CraftCanvas, {
      props: { componentName: "div" },
      global: {
        provide: {},
      },
    });
    await flushPromises();

    expect(wrapper.find("div").exists()).toBe(true);
  });
});
