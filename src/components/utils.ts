import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { BlueprintGroup } from "../lib/model";

export const blueprintsWithDefaults = <T extends object>(
  group: BlueprintGroup,
  resolver: CraftNodeResolver<T>
) => {
  return Object.keys(group.blueprints).map((key) => {
    const blueprint = group.blueprints[key];
    const defaultProps = resolver.getDefaultProps(blueprint as CraftNode);
    return {
      ...blueprint,
      props: { ...defaultProps, ...blueprint.props },
    };
  });
};
