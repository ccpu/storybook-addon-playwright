import React, { createContext, SFC, useEffect } from 'react';
import { Loader } from '../../components/common';
import { useActionData } from '../../hooks';
import { initialState, reducer, ReducerState, Action } from './reducer';
import { useReducer } from 'reinspect';

export const ActionDispatchContext = React.createContext<
  React.Dispatch<Action>
>({} as React.Dispatch<Action>);

export const ActionContext = createContext<ReducerState>({} as ReducerState);

export const ActionContextProvider = ActionContext.Provider;
export const ActionConsumer = ActionContext.Consumer;

const ActionProvider: SFC = (props) => {
  const { children } = props;

  const { actions, loading } = useActionData();

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'ActionProvider',
  );

  useEffect(() => {
    dispatch({ actions, type: 'setActionSchema' });
  }, [actions]);

  return (
    <ActionContextProvider value={state}>
      <ActionDispatchContext.Provider value={dispatch}>
        <Loader open={loading} />
        {children}
      </ActionDispatchContext.Provider>
    </ActionContextProvider>
  );
};

export { ActionProvider };
