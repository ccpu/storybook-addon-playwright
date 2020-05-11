import { getActionSchemaData } from '../action-schema';

jest.mock('../../src/api/server/services/get-actions-schema', () => ({
  getActionsSchema: () => {
    return getActionSchemaData();
  },
}));
