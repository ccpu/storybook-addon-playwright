import '../../../manual-mocks/react-useEffect';
import {
  ActionProvider,
  useActionContext,
  useActionDispatchContext,
} from '../../../../src/features/action-set/store/ActionContext';
import { shallow } from 'enzyme';
import React from 'react';
import { useGlobalActionDispatch } from '../../../../src/features/action-set/hooks/use-global-action-dispatch';
import { useReducer } from 'reinspect';

vi.mock(
  '../../../../src/features/action-set/hooks/use-global-action-dispatch',
  async () => await import('../hooks/__mocks__/use-global-action-dispatch'),
);

describe('ActionProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(<ActionProvider />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle global action call', () => {
    const useReducerMock = useReducer as Mock;
    const dispatchMock = vi.fn();
    let dispatchCallBack;
    useReducerMock.mockImplementationOnce(() => {
      return [{}, dispatchMock];
    });
    (useGlobalActionDispatch as Mock).mockImplementation((cb) => {
      dispatchCallBack = cb;
    });
    shallow(<ActionProvider />);
    dispatchCallBack({ type: 'foo' });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'foo' });
  });

  it('should use useActionContext hook', () => {
    let state;
    const Component = () => {
      state = useActionContext();
      return <div />;
    };
    shallow(<Component />);
    expect(state).toBeDefined();
  });

  it('should use useActionDispatchContext hook', () => {
    let dispatch;
    const Component = () => {
      dispatch = useActionDispatchContext();
      return <div />;
    };
    shallow(<Component />);
    expect(dispatch).toBeDefined();
  });
});
