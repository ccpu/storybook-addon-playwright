import { deleteActionSet as orgDeleteActionSet } from '../../../../src/api/services/delete-action-set';

const deleteActionSet = vi.fn<typeof orgDeleteActionSet>();

export { deleteActionSet };
