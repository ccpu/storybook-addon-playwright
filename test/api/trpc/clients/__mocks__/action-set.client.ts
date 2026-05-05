import { saveActionSet as orgSaveActionSet } from '../../../../../src/api/services/save-action-set';
import { getActionSet as orgGetActionSet } from '../../../../../src/api/services/get-action-set';
import { deleteActionSet as orgDeleteActionSet } from '../../../../../src/api/services/delete-action-set';
import { changeActionSetIndex as orgChangeActionSetIndex } from '../../../../../src/api/services/change-action-set-index';

export const saveActionSet = vi.fn<typeof orgSaveActionSet>();
export const getActionSet = vi.fn<typeof orgGetActionSet>();
export const deleteActionSet = vi.fn<typeof orgDeleteActionSet>();
export const changeActionSetIndex = vi.fn<typeof orgChangeActionSetIndex>();
