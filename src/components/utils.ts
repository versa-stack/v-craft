import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { BlueprintGroup } from "../lib/model";
import { v4 as uuidv4 } from "uuid";

export const blueprintsWithDefaults = <T extends object>(
  group: BlueprintGroup,
  resolver: CraftNodeResolver<T>
) => {
  return Object.keys(group.blueprints).map((key) => {
    const blueprint = group.blueprints[key];
    const defaultProps = resolver.getDefaultProps({
      ...blueprint,
      uuid: uuidv4(),
    } as CraftNode);
    const result = {
      ...blueprint,
      props: { ...defaultProps, ...blueprint.props },
    };
    return result;
  });
};
