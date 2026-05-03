import { router, baseProcedure } from '../trpc';
import { addToFavourite as addFavouriteAction } from '../../services/add-to-favourite';
import { getFavouriteActions } from '../../services/get-favourite-actions';
import { deleteFavouriteAction } from '../../services/delete-favourite-action';
import {
  addFavouriteActionInputSchema,
  deleteFavouriteActionInputSchema,
} from '../../../schema';

export const favouriteActionsRouter = router({
  // mutation: writes favourite action to disk
  addFavouriteAction: baseProcedure
    .input(addFavouriteActionInputSchema)
    .mutation(({ input }) => addFavouriteAction(input)),

  // mutation: deletes favourite action from disk
  deleteFavouriteAction: baseProcedure
    .input(deleteFavouriteActionInputSchema)
    .mutation(({ input }) => deleteFavouriteAction(input)),

  // query: read-only, no side effects
  getFavouriteActions: baseProcedure.query(() => getFavouriteActions()),
});
