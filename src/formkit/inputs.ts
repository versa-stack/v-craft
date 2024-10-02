import { createInput } from "@formkit/vue";

export const inputs = {
  patches: createInput(
    () => {
      if (typeof window === "undefined") {
        return { render: () => null };
      }
      return import("../components/PatchesInputComponent.vue");
    },
    { props: ["context"] }
  ),
  graphql: createInput(
    () => {
      if (typeof window === "undefined") {
        return { render: () => null };
      }
      return import("../components/GraphqlInputComponent.vue");
    },
    { props: ["context"] }
  ),
};
