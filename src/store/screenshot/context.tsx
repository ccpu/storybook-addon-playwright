import React, { SFC, createContext, useContext } from 'react';
import { initialState, reducer, ReducerState, Action } from './reducer';
import { useReducer } from 'reinspect';

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

const ScreenshotProvider: SFC = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'ScreenshotProvider',
  );

  return (
    <ScreenshotContextProvider value={state}>
      <ScreenshotDispatchContext.Provider value={dispatch}>
        {children}
      </ScreenshotDispatchContext.Provider>
    </ScreenshotContextProvider>
  );
};

export { ScreenshotProvider };
