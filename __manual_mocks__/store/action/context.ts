import { ReducerState } from '../../../src/store/actions/reducer';
import { useActionDispatchContext } from '../../../src/store/actions/ActionContext';
import { mocked } from 'ts-jest/utils';

jest.mock('../../../src/store/actions/ActionContext');

export const dispatchMock = jest.fn();

const useActionDispatchContextMock = mocked(useActionDispatchContext);

useActionDispatchContextMock.mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

export { ReducerState };
