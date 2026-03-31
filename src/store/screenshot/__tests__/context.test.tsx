// Changed: vi.mock must be in test file for vitest hoisting. jest.spyOn on
// React.useEffect doesn't intercept static ESM named imports in vitest (unlike
// babel-jest which uses live property reads). The mock routes useEffect calls
// through globalThis.__useEffectSpy, which react-useEffect.ts sets up per test.
vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<any>();
  const hook = (fn: any, deps?: any) =>
    (globalThis as any).__useEffectSpy?.(fn, deps);
  const patchedDefault = { ...(actual.default ?? actual), useEffect: hook };
  return { ...actual, default: patchedDefault, useEffect: hook };
});
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

vi.mock('../../../hooks/use-global-screenshot-dispatch.ts');
vi.mock('../../../hooks//use-global-imageDiff-results');

const useReducerMock = useReducer as Mock;
useReducerMock.mockImplementation(
  (_reducer: unknown, _initialState: unknown, initialStateFn: () => void) => {
    if (initialStateFn) initialStateFn();
    return [{ imageDiffResults: [] }, vi.fn()];
  },
);

describe('ScreenshotProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render', () => {
    const wrapper = shallow(<ScreenshotProvider />);
    expect(wrapper.exists()).toBeTruthy();
  });

  it('should handle global action call', () => {
    const dispatchMock = vi.fn();
    let dispatchCallBack;
    useReducerMock.mockImplementationOnce(() => {
      return [{ imageDiffResults: [] }, dispatchMock];
    });

    (useGlobalScreenshotDispatch as Mock).mockImplementation((cb) => {
      dispatchCallBack = cb;
    });
    shallow(<ScreenshotProvider />);
    dispatchCallBack({ type: 'foo' });
    expect(dispatchMock).toHaveBeenCalledWith({ type: 'foo' });
  });

  it('should set image set failed image diff result on mount', () => {
    const dispatchMock = vi.fn();
    const setImageDiffResultMock = vi.fn();

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

    (useGlobalImageDiffResults as Mock).mockImplementationOnce(() => ({
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
