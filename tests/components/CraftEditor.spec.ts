import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";
import { defineComponent, nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftEditor from "../../src/components/CraftEditor.vue";
import CraftFrame from "../../src/components/CraftFrame.vue";
import CraftNodeEditor from "../../src/components/CraftNodeEditor.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";
import { v4 as uuidv4 } from "uuid";

const CustomComponent = defineComponent({
  name: "CustomComponent",
  template: `<div class="custom-component">custom component</div>`,
});

const ResolverComponent = defineComponent({
  name: "ResolverComponent",
  template: `<div class="resolver-component">resolver component</div>`,
});

describe("CraftEditor", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("uses provided resolver instance from config", () => {
    const resolver = new CraftNodeResolver({
      CustomComponent: {
        componentName: "CustomComponent",
        component: CustomComponent,
      },
    } as CraftNodeResolverMap<any>);

    const config = {
      blueprintsLibrary: { groups: [] },
      resolver,
    };

    const wrapper = mount(CraftEditor, {
      props: { config },
      global: {
        components: { CraftFrame, CraftCanvas },
      },
    });

    expect(wrapper.vm).toBeTruthy();
  });

  it("creates new resolver from resolverMap when resolver not provided", () => {
    const resolverMap: CraftNodeResolverMap<any> = {
      CustomComponent: {
        componentName: "CustomComponent",
        component: CustomComponent,
      },
    };

    const config = {
      blueprintsLibrary: { groups: [] },
      resolverMap,
    };

    const wrapper = mount(CraftEditor, {
      props: { config },
      global: {
        components: { CraftFrame, CraftCanvas },
      },
    });

    expect(wrapper.vm).toBeTruthy();
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

    const config = {
      blueprintsLibrary: { groups: [] },
      resolver,
    };

    const wrapper = mount(CraftEditor, {
      props: { config },
      global: {
        components: { CraftFrame, CraftCanvas },
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
      CustomComponent: {
        componentName: "CustomComponent",
        component: CustomComponent,
      },
    } as CraftNodeResolverMap<any>);

    const mapResolver: CraftNodeResolverMap<any> = {
      ResolverComponent: {
        componentName: "ResolverComponent",
        component: ResolverComponent,
      },
    };

    const config = {
      blueprintsLibrary: { groups: [] },
      resolver: instanceResolver,
      resolverMap: mapResolver,
    };

    const wrapper = mount(CraftEditor, {
      props: { config },
      global: {
        components: { CraftFrame, CraftCanvas },
      },
    });

    expect(wrapper.vm).toBeTruthy();
  });
});
