import { z } from 'zod';
import { router, baseProcedure } from '../../trpc/trpc';
import {
  saveActionSet,
  getActionSet,
  deleteActionSet,
} from './action-set.service';

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
