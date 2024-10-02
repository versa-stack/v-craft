import { createInput } from "@formkit/vue";
import PatchesInputComponent from "../components/PatchesInputComponent.vue";
import GraphqlInputComponent from "../components/GraphqlInputComponent.vue";

export const inputs = {
  patches: createInput(PatchesInputComponent, { props: ["context"] }),
  graphql: createInput(GraphqlInputComponent, { props: ["context"] }),
};
