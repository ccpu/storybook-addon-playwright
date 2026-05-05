import { getActionSet as orgGetActionSet } from '../../../../src/api/services/get-action-set';

const getActionSet = vi.fn<typeof orgGetActionSet>();

export { getActionSet };
