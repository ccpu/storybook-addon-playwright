import '../../../../__manual_mocks__/react-useEffect';
import {
  ActionProvider,
  useActionContext,
  useActionDispatchContext,
} from '../ActionContext';
import { shallow } from 'enzyme';
import React from 'react';
import { useGlobalActionDispatch } from '../../../hooks/use-global-action-dispatch';
import { useReducer } from 'reinspect';

jest.mock('../../../hooks/use-global-action-dispatch.ts');

describe('ActionProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should render', () => {
    const wrapper = shallow(<ActionProvider />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle global action call', () => {
    const useReducerMock = useReducer as jest.Mock;
    const dispatchMock = jest.fn();

    useReducerMock.mockImplementationOnce(() => {
      return [{}, dispatchMock];
    });
    (useGlobalActionDispatch as jest.Mock).mockImplementationOnce(() => ({
      action: { type: 'foo' },
    }));
    shallow(<ActionProvider />);
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
