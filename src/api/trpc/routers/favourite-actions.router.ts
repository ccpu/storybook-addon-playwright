import {
  addFavouriteActionInputSchema,
  deleteFavouriteActionInputSchema,
} from '../../../schema';
import { addToFavourite as addFavouriteAction } from '../../services/add-to-favourite';
import { deleteFavouriteAction } from '../../services/delete-favourite-action';
import { getFavouriteActions } from '../../services/get-favourite-actions';
import { baseProcedure, router } from '../trpc';

export const favouriteActionsRouter = router({
  // mutation: writes favourite action to disk
  addFavouriteAction: baseProcedure
    .input(addFavouriteActionInputSchema)
    .mutation(async ({ input }) => addFavouriteAction(input)),

  // mutation: deletes favourite action from disk
  deleteFavouriteAction: baseProcedure
    .input(deleteFavouriteActionInputSchema)
    .mutation(async ({ input }) => deleteFavouriteAction(input)),

  // query: read-only, no side effects
  getFavouriteActions: baseProcedure.query(async () => getFavouriteActions()),
});
