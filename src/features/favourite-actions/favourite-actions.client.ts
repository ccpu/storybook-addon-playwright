import { trpc } from '../../trpc/client';
import type { RouterInput, RouterOutput } from '../../trpc/router';

export const addFavouriteAction = (
  input: RouterInput['favouriteActions']['addFavouriteAction'],
): Promise<RouterOutput['favouriteActions']['addFavouriteAction']> =>
  trpc.favouriteActions.addFavouriteAction.mutate(input);

export const getFavouriteActions = (): Promise<
  RouterOutput['favouriteActions']['getFavouriteActions']
> => trpc.favouriteActions.getFavouriteActions.query();

export const deleteFavouriteAction = (
  input: RouterInput['favouriteActions']['deleteFavouriteAction'],
): Promise<RouterOutput['favouriteActions']['deleteFavouriteAction']> =>
  trpc.favouriteActions.deleteFavouriteAction.mutate(input);
