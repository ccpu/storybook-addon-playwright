import { FavouriteActionSet } from '../../../typings/story-action';

export const filterFavouriteActions = (
  actions: FavouriteActionSet[],
  storyId: string,
) => {
  return actions.reduce((arr, item) => {
    if (item.visibleTo === '*' || new RegExp(item.visibleTo).test(storyId)) {
      arr.push(item);
    }
    return arr;
  }, []);
};
