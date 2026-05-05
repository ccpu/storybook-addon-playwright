import {
  validAction as orgValidAction,
  validateActionList as orgValidateActionList,
} from '../../../src/utils/valid-action';

export const validAction = vi.fn<typeof orgValidAction>();
export const validateActionList = vi.fn<typeof orgValidateActionList>();

validAction.mockImplementation(() => ({}));
