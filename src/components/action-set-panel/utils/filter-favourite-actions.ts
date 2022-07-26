import { ActionSet } from '../../../typings/story-action';

export const filterFavouriteActions = (
  actions: ActionSet[],
  storyId: string,
) => {
  return actions.reduce((arr, item) => {
    if (item.visibleTo === '*' || new RegExp(item.visibleTo).test(storyId)) {
      arr.push(item);
    }
    return arr;
  }, []);
};
