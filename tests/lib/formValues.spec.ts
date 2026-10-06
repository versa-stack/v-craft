import { describe, expect, it } from "vitest";
import { formValues } from "../../src/lib/formValues";

const n = (uuid: string, parentUuid: string | null, props: Record<string, unknown> = {}) =>
  ({ uuid, parentUuid, componentName: "X", props, slots: {} }) as any;

const nodes = {
  form: n("form", null),
  typed: n("typed", "form", { name: "first" }),
  group: n("group", "form"),
  pre: n("pre", "group", { name: "email", modelValue: "pre@x.de" }),
  out: n("out", null, { name: "other" }),
};

describe("formValues", () => {
  it("reads typed and untouched prefilled fields by name", () => {
    expect(formValues(nodes, { typed: { value: "Ada" }, out: { value: "X" } }, "form")).toEqual({
      first: "Ada",
      email: "pre@x.de",
    });
  });

  it("excludes fields outside the scope", () => {
    expect(formValues(nodes, { out: { value: "X" } }, "form")).not.toHaveProperty("other");
  });

  it("prefers a captured value over the prefill", () => {
    expect(formValues(nodes, { pre: { value: "typed@x.de" } }, "form").email).toBe("typed@x.de");
  });
});
