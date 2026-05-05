import { FavouriteActionSet } from '../../../../../typings/story-action';

export const filterFavouriteActions = (
  actions: FavouriteActionSet[],
  storyId: string,
) => {
  return actions.reduce<FavouriteActionSet[]>((arr, item) => {
    const visibleTo = item.visibleTo || '*';

    if (visibleTo === '*' || new RegExp(visibleTo).test(storyId)) {
      arr.push(item);
    }
    return arr;
  }, []);
};
