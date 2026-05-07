import { z } from 'zod';

import { favouriteActionSetSchema } from './action-set';

export const addFavouriteActionInputSchema = favouriteActionSetSchema;

export const deleteFavouriteActionInputSchema = z.object({
  actionSetId: z.string(),
});

export const favouriteActionsDataSchema = z.object({
  actionSets: z.array(favouriteActionSetSchema),
});

export type AddFavouriteActionInput = z.infer<typeof addFavouriteActionInputSchema>;
export type DeleteFavouriteActionInput = z.infer<typeof deleteFavouriteActionInputSchema>;
export type FavouriteActionsData = z.infer<typeof favouriteActionsDataSchema>;
