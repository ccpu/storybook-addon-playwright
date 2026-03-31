import { ReducerState } from '../../../src/store/actions/reducer';
import { useActionDispatchContext } from '../../../src/store/actions/ActionContext';

vi.mock('../../../src/store/actions/ActionContext');

export const dispatchMock = vi.fn();

const useActionDispatchContextMock = vi.mocked(useActionDispatchContext);

useActionDispatchContextMock.mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

export { ReducerState };
