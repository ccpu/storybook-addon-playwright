import { getActionSchemaData } from '../../../action-schema';

export const dispatchMock = jest.fn();

jest.mock('../../../../src/store/actions/ActionContext', () => ({
  useActionContext: () => {
    return {
      actionSchema: getActionSchemaData(),
      expandedActions: [],
    };
  },
  useActionDispatchContext: () => {
    return (...arg) => dispatchMock(arg);
  },
}));
