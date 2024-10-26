// useGraphqlQuery.spec.ts
import { ref } from "vue";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { ApolloClient, NormalizedCacheObject } from "@apollo/client/core";

// Mock the entire @vue/apollo-composable module
vi.mock("@vue/apollo-composable", () => ({
  useApolloClient: vi.fn(),
}));

// Import the mocked useApolloClient
import { useApolloClient } from "@vue/apollo-composable";
import { useGraphqlQuery } from "../../../src/components/composable/useGraphqlQuery";

describe("useGraphqlQuery", () => {
  let mockClient: ApolloClient<NormalizedCacheObject>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient = {
      readQuery: vi.fn(),
      query: vi.fn(),
    } as unknown as ApolloClient<NormalizedCacheObject>;

    vi.mocked(useApolloClient).mockReturnValue({
      client: mockClient,
      resolveClient: vi.fn().mockResolvedValue(mockClient),
    });
  });

  it("fetches and maps data correctly", async () => {
    const mockData = { test: { nested: "value" } };
    mockClient.query.mockResolvedValue({ data: mockData });
    mockClient.readQuery.mockReturnValue(null);

    const query = ref("query { test }");
    const variables = ref("{}");
    const map = ref({
      type: "single",
      fromPath: "$",
      patches: [
        {
          fromPath: "$.test.nested",
          toPath: "$.mappedValue",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
      ],
    });
    const childRef = ref({ childData: "test" });

    const { fetchData, mappedData } = useGraphqlQuery(
      query,
      variables,
      map,
      childRef
    );

    await fetchData();

    expect(mockClient.query).toHaveBeenCalledWith({
      query: expect.anything(),
      variables: {},
    });

    expect(mappedData.value).toEqual({
      type: "single",
      item: { mappedValue: "value" },
      list: undefined,
    });
  });

  it("uses cached data if available", async () => {
    const cachedData = { test: { nested: "cachedValue" } };
    mockClient.readQuery.mockReturnValue(cachedData);

    const query = ref("query { test }");
    const variables = ref("{}");
    const map = ref({
      type: "single",
      fromPath: "$",
      patches: [
        {
          fromPath: "$.test.nested",
          toPath: "$.mappedValue",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
      ],
    });
    const childRef = ref({ childData: "test" });

    const { fetchData, mappedData } = useGraphqlQuery(
      query,
      variables,
      map,
      childRef
    );

    await fetchData();

    expect(mockClient.query).not.toHaveBeenCalled();
    expect(mappedData.value).toEqual({
      type: "single",
      item: { mappedValue: "cachedValue" },
      list: undefined,
    });
  });

  it("handles child data correctly", async () => {
    const mockData = { parentData: "parentValue" };
    mockClient.query.mockResolvedValue({ data: mockData });
    mockClient.readQuery.mockReturnValue(null);

    const query = ref("query { parentData }");
    const variables = ref("{}");
    const map = ref({
      type: "single",
      fromPath: "$",
      patches: [
        {
          fromPath: "$.childData",
          toPath: "$.mappedChildValue",
          type: "single",
          patchSource: "child",
          value: null,
        },
      ],
    });
    const childRef = ref({ childData: "childValue" });

    const { fetchData, mappedData } = useGraphqlQuery(
      query,
      variables,
      map,
      childRef
    );

    await fetchData();

    expect(mappedData.value).toEqual({
      type: "single",
      item: { mappedChildValue: "childValue" },
      list: undefined,
    });
  });

  it("handles list type mapping", async () => {
    const mockData = {
      tests: [
        { id: 1, value: "one" },
        { id: 2, value: "two" },
      ],
    };
    mockClient.query.mockResolvedValue({ data: mockData });
    mockClient.readQuery.mockReturnValue(null);

    const query = ref("query { tests { id value } }");
    const variables = ref("{}");
    const map = ref({
      type: "list",
      fromPath: "$.tests[*]",
      patches: [
        {
          fromPath: "$.id",
          toPath: "$.mappedId",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
        {
          fromPath: "$.value",
          toPath: "$.mappedValue",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
        },
      ],
    });
    const childRef = ref({});

    const { fetchData, mappedData } = useGraphqlQuery(
      query,
      variables,
      map as any,
      childRef
    );

    await fetchData();

    expect(mappedData.value).toEqual({
      type: "list",
      item: undefined,
      list: [
        { mappedId: 1, mappedValue: "one" },
        { mappedId: 2, mappedValue: "two" },
      ],
    });
  });

  it("uses default values when data is missing", async () => {
    const mockData = { test: null };
    mockClient.query.mockResolvedValue({ data: mockData });
    mockClient.readQuery.mockReturnValue(null);

    const query = ref("query { test }");
    const variables = ref("{}");
    const map = ref({
      type: "single",
      fromPath: "$",
      patches: [
        {
          fromPath: "$.test",
          toPath: "$.mappedValue",
          type: "single",
          patchSource: "mapPathResult",
          value: null,
          default: "defaultValue",
        },
      ],
    });
    const childRef = ref({});

    const { fetchData, mappedData } = useGraphqlQuery(
      query,
      variables,
      map,
      childRef
    );

    await fetchData();

    expect(mappedData.value).toEqual({
      type: "single",
      item: { mappedValue: "defaultValue" },
      list: undefined,
    });
  });
});
