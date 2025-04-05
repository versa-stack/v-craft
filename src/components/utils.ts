import { CraftNode } from "../lib/craftNode";
import CraftNodeResolver from "../lib/CraftNodeResolver";
import { BlueprintGroup } from "../lib/model";

export const blueprintsWithDefaults = <T extends object>(group: BlueprintGroup<T>, resolver: CraftNodeResolver<T>) => {
  const returnVal: any[] = [];
  Object.keys(group.blueprints).forEach((key) => {
    const blueprint = group.blueprints[key];
    const defaultProps = resolver.getDefaultProps(
      blueprint as CraftNode<T>
    );
    blueprint.props = { ...defaultProps, ...blueprint.props };
    returnVal.push(blueprint);
  });

  return returnVal;
};