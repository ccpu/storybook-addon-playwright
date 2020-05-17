import { getActionSchemaData } from '../../../action-schema';
import { ReducerState } from '../../../../src/store/actions/reducer';

export const dispatchMock = jest.fn();

const mockData: Partial<ReducerState> = {
  actionSchema: getActionSchemaData(),
};

export const useActionContext = jest.fn() as jest.Mock<Partial<ReducerState>>;
useActionContext.mockImplementation(() => mockData);

jest.mock('../../../../src/store/actions/ActionContext', () => ({
  useActionContext,
  useActionDispatchContext: () => {
    return (...arg) => {
      return dispatchMock(arg);
    };
  },
}));

export { ReducerState };
