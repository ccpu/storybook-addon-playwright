import { ReducerState } from '../../../src/features/action-set/store/reducer';
import { useActionDispatchContext } from '../../../src/features/action-set/store/ActionContext';

vi.mock('../../../src/features/action-set/store/ActionContext');

export const dispatchMock = vi.fn();

const useActionDispatchContextMock = vi.mocked(useActionDispatchContext);

useActionDispatchContextMock.mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

export { ReducerState };
