import { ReducerState } from '../../../../src/features/action-set/store/reducer';

const useActionDispatchContextMock = vi.fn();
export const dispatchMock = vi.fn();

vi.mock('../../../../src/features/action-set/store/ActionContext', async () => {
  const mock = await import(
    '../../../features/action-set/store/__mocks__/ActionContext'
  );
  return {
    ...mock,
    useActionDispatchContext: useActionDispatchContextMock,
  };
});

useActionDispatchContextMock.mockImplementation(() => {
  return (...arg) => {
    return dispatchMock(arg);
  };
});

export { ReducerState };
