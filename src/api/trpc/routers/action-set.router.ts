import { z } from 'zod';
import { router, baseProcedure } from '../trpc';
import { saveActionSet } from '../../services/save-action-set';
import { getActionSet } from '../../services/get-action-set';
import { deleteActionSet } from '../../services/delete-action-set';

export const actionSetRouter = router({
  // mutation: deletes from FS
  deleteActionSet: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => deleteActionSet(input)),

  // mutation: reads FS as part of a stateful lookup
  getActionSet: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => getActionSet(input)),

  // mutation: writes to FS
  saveActionSet: baseProcedure
    .input(z.any()) // TODO: replace z.any() with typed Zod schema
    .mutation(({ input }) => saveActionSet(input)),
});
