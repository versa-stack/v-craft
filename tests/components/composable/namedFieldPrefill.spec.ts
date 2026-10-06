import { describe, expect, it } from "vitest";
import type { CraftNode } from "../../../src/lib/craftNode";
import { useResolveCraftNodeProps } from "../../../src/components/composable/useResolveCraftNodeProps";

const field = (props: Record<string, unknown>, slotsPropsPropsMap?: CraftNode["slotsPropsPropsMap"]) =>
  ({ uuid: "f", componentName: "UInput", props, slots: {}, slotsPropsPropsMap }) as unknown as CraftNode;

describe("named field prefill", () => {
  it("a named field defaults to the bound record at its name", () => {
    const { props } = useResolveCraftNodeProps(field({ name: "address.city" }), { data: { address: { city: "Köln" } } });
    expect(props.value.defaultValue).toBe("Köln");
  });

  it("an explicit value or mapping wins", () => {
    expect(useResolveCraftNodeProps(field({ name: "a", modelValue: "x" }), { data: { a: "y" } }).props.value).not.toHaveProperty("defaultValue");
    const mapped = field({ name: "a" }, { data: { defaultValue: "$.b" } });
    expect(useResolveCraftNodeProps(mapped, { data: { a: "y", b: "z" } }).props.value.defaultValue).toBe("z");
  });

  it("nothing bound, nothing set", () => {
    expect(useResolveCraftNodeProps(field({ name: "a" }), {}).props.value).not.toHaveProperty("defaultValue");
  });
});
