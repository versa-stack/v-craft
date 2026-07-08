import { describe, expect, it } from "vitest";
import CraftNodeResolver from "../../src/lib/CraftNodeResolver";

describe("CraftNodeResolver.resolvePropertyValue", () => {
  it("resolves a bare string mapping as a JSONPath when no hook is registered", () => {
    const resolver = new CraftNodeResolver();
    expect(resolver.resolvePropertyValue("$.name", { name: "Alice" })).toBe(
      "Alice",
    );
  });

  it("returns undefined for a non-string mapping when no hook is registered", () => {
    const resolver = new CraftNodeResolver();
    expect(
      resolver.resolvePropertyValue({ sources: ["$.name"] }, { name: "Alice" }),
    ).toBeUndefined();
  });

  it("lets a registered hook interpret the mapping and wins over the default", () => {
    const resolver = new CraftNodeResolver();
    resolver.onResolvePropertyValue((mapping, contextData, defaultResolve) => {
      if (typeof mapping === "string") return defaultResolve(mapping);
      const { sources } = mapping as { sources: string[] };
      return sources.map((path) => defaultResolve(path)).join(" ");
    });

    expect(
      resolver.resolvePropertyValue(
        { sources: ["$.first", "$.last"] },
        { first: "Ada", last: "Lovelace" },
      ),
    ).toBe("Ada Lovelace");
  });

  it("still delegates plain string mappings to defaultResolve once a hook is registered", () => {
    const resolver = new CraftNodeResolver();
    resolver.onResolvePropertyValue((mapping, contextData, defaultResolve) =>
      typeof mapping === "string" ? defaultResolve(mapping) : undefined,
    );

    expect(resolver.resolvePropertyValue("$.name", { name: "Alice" })).toBe(
      "Alice",
    );
  });
});
