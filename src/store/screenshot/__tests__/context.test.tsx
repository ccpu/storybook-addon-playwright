import '../../../../__manual_mocks__/react-useEffect';
import {
  ScreenshotProvider,
  useScreenshotContext,
  useScreenshotDispatch,
} from '../context';
import { shallow } from 'enzyme';
import React from 'react';
import { useGlobalScreenshotDispatch } from '../../../hooks/use-global-screenshot-dispatch';
import { useReducer } from 'reinspect';
import { useGlobalImageDiffResults } from '../../../hooks//use-global-imageDiff-results';
import { ImageDiffResult } from '../../../api/typings';

jest.mock('../../../hooks/use-global-screenshot-dispatch.ts');
jest.mock('../../../hooks//use-global-imageDiff-results');

const useReducerMock = useReducer as jest.Mock;
useReducerMock.mockImplementation(
  (_reducer: unknown, _initialState: unknown, initialStateFn: () => void) => {
    if (initialStateFn) initialStateFn();
    return [{ imageDiffResults: [] }, jest.fn()];
  },
);

describe('ScreenshotProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotProvider />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle global action call', () => {
    const dispatchMock = jest.fn();

    useReducerMock.mockImplementationOnce(() => {
      return [{ imageDiffResults: [] }, dispatchMock];
    });

    (useGlobalScreenshotDispatch as jest.Mock).mockImplementationOnce(() => ({
      action: { type: 'foo' },
    }));
    shallow(<ScreenshotProvider />);
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'foo' });
  });

  it('should set image set failed image diff result on mount', () => {
    const dispatchMock = jest.fn();
    const setImageDiffResultMock = jest.fn();

    useReducerMock.mockImplementationOnce(() => {
      return [
        {
          imageDiffResults: [
            { pass: false, screenshotId: 'screenshot-id' },
          ] as ImageDiffResult[],
        },
        dispatchMock,
      ];
    });

    (useGlobalImageDiffResults as jest.Mock).mockImplementationOnce(() => ({
      setImageDiffResult: setImageDiffResultMock,
    }));

    shallow(<ScreenshotProvider />);
    expect(setImageDiffResultMock).toHaveBeenCalledWith([
      { pass: false, screenshotId: 'screenshot-id' },
    ]);
  });

  it('should use useActionContext hook', () => {
    let state;
    const Component = () => {
      state = useScreenshotDispatch();
      return <div />;
    };
    shallow(<Component />);
    expect(state).toBeDefined();
  });

  it('should use useActionDispatchContext hook', () => {
    let dispatch;
    const Component = () => {
      dispatch = useScreenshotContext();
      return <div />;
    };
    shallow(<Component />);
    expect(dispatch).toBeDefined();
  });
});
