import { Definition } from 'ts-to-json';
import { ActionMenuItemBase } from '../ActionMenuItem';

export const getMenu = (
  def: Definition,
  parents: string[] = [],
): ActionMenuItemBase[] => {
  const actionArr = Object.keys(def);
  let menuItems: ActionMenuItemBase[] = [];
  actionArr.forEach((actionKey) => {
    const prop = def[actionKey];

    if (prop.type === 'object') {
      const childProps = getMenu(prop.properties, [...parents, actionKey]);
      menuItems = [...menuItems, ...childProps];
    } else {
      const label = [...parents, actionKey];
      menuItems.push({
        label: label.join('.'),
        name: label.join('.'),
      });
    }
  });

  return menuItems;
};
