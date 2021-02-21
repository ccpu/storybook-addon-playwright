import React, { createContext, useContext, useEffect } from 'react';
import { initialState, reducer, ReducerState, Action } from './reducer';
import { useReducer } from 'reinspect';
import {
  useGlobalScreenshotDispatch,
  useGlobalImageDiffResults,
} from '../../hooks';

export const ScreenshotDispatchContext = React.createContext<
  React.Dispatch<Action>
>({} as React.Dispatch<Action>);

export const useScreenshotDispatch = () =>
  useContext(ScreenshotDispatchContext);

export const ScreenshotContext = createContext<ReducerState>(
  {} as ReducerState,
);
export const useScreenshotContext = () => useContext(ScreenshotContext);

export const ScreenshotContextProvider = ScreenshotContext.Provider;
export const ScreenshotConsumer = ScreenshotContext.Consumer;

const ScreenshotProvider: React.FC = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'Screenshot',
  );

  useGlobalScreenshotDispatch((action) => {
    dispatch(action);
  });

  const { setImageDiffResult } = useGlobalImageDiffResults();

  useEffect(() => {
    setImageDiffResult(state.imageDiffResults.filter((x) => !x.pass));
  }, [setImageDiffResult, state.imageDiffResults]);

  return (
    <ScreenshotContextProvider value={state}>
      <ScreenshotDispatchContext.Provider value={dispatch}>
        {children}
      </ScreenshotDispatchContext.Provider>
    </ScreenshotContextProvider>
  );
};

export { ScreenshotProvider };
