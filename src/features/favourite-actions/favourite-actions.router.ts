import { z } from 'zod';
import { router, baseProcedure } from '../../trpc/trpc';
import {
  addFavouriteAction,
  getFavouriteActions,
  deleteFavouriteAction,
} from './favourite-actions.service';

export const favouriteActionsRouter = router({
  // mutation: writes favourite action to disk
  addFavouriteAction: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => addFavouriteAction(input)),

  // mutation: deletes favourite action from disk
  deleteFavouriteAction: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => deleteFavouriteAction(input)),

  // query: read-only, no side effects
  getFavouriteActions: baseProcedure.query(() => getFavouriteActions()),
});
