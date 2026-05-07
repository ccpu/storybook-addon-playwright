import {
  changeActionSetIndexInputSchema,
  deleteActionSetInputSchema,
  getActionSetInputSchema,
  saveActionSetInputSchema,
} from '../../../schema';
import { changeActionSetIndex } from '../../services/change-action-set-index';
import { deleteActionSet } from '../../services/delete-action-set';
import { getActionSet } from '../../services/get-action-set';
import { saveActionSet } from '../../services/save-action-set';
import { baseProcedure, router } from '../trpc';

export const actionSetRouter = router({
  // mutation: reorders action sets in FS
  changeActionSetIndex: baseProcedure
    .input(changeActionSetIndexInputSchema)
    .mutation(async ({ input }) => changeActionSetIndex(input)),

  // mutation: deletes from FS
  deleteActionSet: baseProcedure
    .input(deleteActionSetInputSchema)
    .mutation(async ({ input }) => deleteActionSet(input)),

  // mutation: reads FS as part of a stateful lookup
  getActionSet: baseProcedure
    .input(getActionSetInputSchema)
    .mutation(async ({ input }) => getActionSet(input)),

  // mutation: writes to FS
  saveActionSet: baseProcedure
    .input(saveActionSetInputSchema)
    .mutation(async ({ input }) => saveActionSet(input)),
});
