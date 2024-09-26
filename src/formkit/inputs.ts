import { createInput } from "@formkit/vue";
import {
  GraphqlInputComponent,
  PatchesInputComponent,
} from "../components";

export const inputs = {
  patches: createInput(PatchesInputComponent, { props: ["context"] }),
  graphql: createInput(GraphqlInputComponent, { props: ["context"] }),
};
