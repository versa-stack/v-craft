// mapGraphqlData.spec.ts
import { describe, it, expect } from "vitest";
import { CraftGraphqlQueryWrapperPropMap } from "../src/lib/model";
import { mapGraphqlData } from "../src/lib/mapGraphqlData";

describe("mapGraphqlData", () => {
  it("should map a single object correctly", () => {
    const data = {
      user: {
        name: "John Doe",
        age: 30,
        email: "john@example.com",
      },
    };

    const map: CraftGraphqlQueryWrapperPropMap = {
      type: "single",
      fromPath: "$.user",
      patches: [
        {
          fromPath: "$.name",
          toPath: "$.fullName",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "$.age",
          toPath: "$.userAge",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
      ],
    };

    const result = mapGraphqlData(data, map, {});

    expect(result).toEqual({
      type: "single",
      item: {
        fullName: "John Doe",
        userAge: 30,
      },
      list: undefined,
    });
  });

  it("should map a list of objects correctly", () => {
    const data = {
      users: [
        { name: "John Doe", age: 30 },
        { name: "Jane Doe", age: 28 },
      ],
    };

    const map: CraftGraphqlQueryWrapperPropMap = {
      type: "list",
      fromPath: "$.users[*]",
      patches: [
        {
          fromPath: "$.name",
          toPath: "$.fullName",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "$.age",
          toPath: "$.userAge",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
      ],
    };

    const result = mapGraphqlData(data, map, {});

    expect(result).toEqual({
      type: "list",
      item: undefined,
      list: [
        { fullName: "John Doe", userAge: 30 },
        { fullName: "Jane Doe", userAge: 28 },
      ],
    });
  });

  it("should use default values when data is missing", () => {
    const data = {
      user: {
        name: "John Doe",
      },
    };

    const map: CraftGraphqlQueryWrapperPropMap = {
      type: "single",
      fromPath: "$.user",
      patches: [
        {
          fromPath: "$.name",
          toPath: "$.fullName",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "$.age",
          toPath: "$.userAge",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
          default: "Unknown",
        },
      ],
    };

    const result = mapGraphqlData(data, map, {});

    expect(result).toEqual({
      type: "single",
      item: {
        fullName: "John Doe",
        userAge: "Unknown",
      },
      list: undefined,
    });
  });

  it('should use child data when patchSource is "child"', () => {
    const data = {
      user: {
        name: "John Doe",
      },
    };

    const childRef = {
      childData: {
        age: 30,
      },
    };

    const map: CraftGraphqlQueryWrapperPropMap = {
      type: "single",
      fromPath: "$.user",
      patches: [
        {
          fromPath: "$.name",
          toPath: "$.fullName",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "$.childData.age",
          toPath: "$.userAge",
          type: "single",
          patchSource: "child",
          value: null,
        },
      ],
    };

    const result = mapGraphqlData(data, map, childRef);

    expect(result).toEqual({
      type: "single",
      item: {
        fullName: "John Doe",
        userAge: 30,
      },
      list: undefined,
    });
  });

  it('should use value when patchSource is "value"', () => {
    const data = {
      user: {
        name: "John Doe",
      },
    };

    const map: CraftGraphqlQueryWrapperPropMap = {
      type: "single",
      fromPath: "$.user",
      patches: [
        {
          fromPath: "$.name",
          toPath: "$.fullName",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "",
          toPath: "$.userType",
          type: "single",
          patchSource: "value",
          value: "Admin",
        },
      ],
    };

    const result = mapGraphqlData(data, map, {});

    expect(result).toEqual({
      type: "single",
      item: {
        fullName: "John Doe",
        userType: "Admin",
      },
      list: undefined,
    });
  });
});
