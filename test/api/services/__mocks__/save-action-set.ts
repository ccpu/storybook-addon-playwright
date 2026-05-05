import { saveActionSet as orgSaveActionSet } from '../../../../src/api/services/save-action-set';

const saveActionSet = vi.fn<typeof orgSaveActionSet>();

export { saveActionSet };
