import { router, baseProcedure } from '../trpc';
import { saveActionSet } from '../../services/save-action-set';
import { getActionSet } from '../../services/get-action-set';
import { deleteActionSet } from '../../services/delete-action-set';
import { changeActionSetIndex } from '../../services/change-action-set-index';
import {
  changeActionSetIndexInputSchema,
  deleteActionSetInputSchema,
  getActionSetInputSchema,
  saveActionSetInputSchema,
} from '../../../schema';

export const actionSetRouter = router({
  // mutation: reorders action sets in FS
  changeActionSetIndex: baseProcedure
    .input(changeActionSetIndexInputSchema)
    .mutation(({ input }) => changeActionSetIndex(input)),

  // mutation: deletes from FS
  deleteActionSet: baseProcedure
    .input(deleteActionSetInputSchema)
    .mutation(({ input }) => deleteActionSet(input)),

  // mutation: reads FS as part of a stateful lookup
  getActionSet: baseProcedure
    .input(getActionSetInputSchema)
    .mutation(({ input }) => getActionSet(input)),

  // mutation: writes to FS
  saveActionSet: baseProcedure
    .input(saveActionSetInputSchema)
    .mutation(({ input }) => saveActionSet(input)),
});
