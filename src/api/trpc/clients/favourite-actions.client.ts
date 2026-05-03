import type { RouterInput, RouterOutput } from '../router';
import { createTrpcHttpClient } from '../client';

const client = createTrpcHttpClient();

export const addFavouriteAction = (
  input: RouterInput['favouriteActions']['addFavouriteAction'],
): Promise<RouterOutput['favouriteActions']['addFavouriteAction']> =>
  client.favouriteActions.addFavouriteAction.mutate(input);

export const getFavouriteActions = (): Promise<
  RouterOutput['favouriteActions']['getFavouriteActions']
> => client.favouriteActions.getFavouriteActions.query();

export const deleteFavouriteAction = (
  input: RouterInput['favouriteActions']['deleteFavouriteAction'],
): Promise<RouterOutput['favouriteActions']['deleteFavouriteAction']> =>
  client.favouriteActions.deleteFavouriteAction.mutate(input);
