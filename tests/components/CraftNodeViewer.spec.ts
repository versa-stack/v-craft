import { FormKitSchemaFormKit } from "@formkit/core";
import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { v4 as uuidv4 } from "uuid";
import { beforeEach, describe, expect, it } from "vitest";
import { nextTick, ref } from "vue";
import CraftCanvas from "../../src/components/CraftCanvas.vue";
import CraftComponentSimpleText from "../../src/components/CraftComponentSimpleText.vue";
import CraftNodeViewer from "../../src/components/CraftNodeViewer.vue";
import { CraftNode } from "../../src/lib/craftNode";
import CraftNodeResolver, {
  CraftNodeResolverMap,
} from "../../src/lib/CraftNodeResolver";
import { defaultResolvers } from "../../src/resolvers/default";
import { useEditor } from "../../src/store/editor";

const createSimpleText = (
  content: string = "Hello World",
  componentName: string = "h1"
) => {
  return {
    componentName: "CraftComponentSimpleText",
    props: {
      content,
      componentName,
    },
    children: [],
    uuid: uuidv4(),
  };
};

const createCanvas = <T extends object = FormKitSchemaFormKit>(
  children: CraftNode<T>[]
) => {
  return {
    componentName: "CraftCanvas",
    props: {
      componentName: "div"
    },
    children,
    uuid: uuidv4(),
  };
};

describe("CraftNodeViewer", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("renders the correct component based on the craftNode", async () => {
    const craftNode = ref(createSimpleText());

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeViewer, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()
    ).toBe(true);
    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("p");
  });

  it("renders the correct component tree based on craftNode", async () => {
    const craftNode = ref(createCanvas([createSimpleText()]));
    const editor = useEditor()();
    editor.enable();

    const resolver = ref(
      new CraftNodeResolver({
        CraftComponentSimpleText: defaultResolvers.CraftComponentSimpleText,
        CraftCanvas: defaultResolvers.CraftCanvas,
        div: {
          componentName: "div"
        }
      } as CraftNodeResolverMap<any>)
    );

    const wrapper = mount(CraftNodeViewer, {
      props: {
        craftNode: craftNode.value,
      },
      global: {
        components: {
          CraftNodeViewer,
          CraftComponentSimpleText,
          CraftCanvas,
        },
        provide: {
          resolver,
        },
      },
    });

    expect(
      wrapper.findComponent({ name: "CraftCanvas" }).exists()
    ).toBe(true);
    
    expect(
      wrapper.findComponent({ name: "CraftComponentSimpleText" }).exists()
    ).toBe(true);

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("h1");
    expect(wrapper.text()).toContain("Hello World");

    craftNode.value.children[0].props.componentName = "p";
    await nextTick();

    expect(
      wrapper
        .findComponent({
          name: "CraftComponentSimpleText",
        })
        .element.tagName.toLowerCase()
    ).toBe("p");
  });
});
