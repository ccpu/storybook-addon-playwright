import React, { SFC, createContext, useContext, useEffect } from 'react';
import { initialState, reducer, ReducerState, Action } from './reducer';
import { useReducer } from 'reinspect';
import { useGlobalActionDispatch } from '../../hooks';

export const ActionDispatchContext = React.createContext<
  React.Dispatch<Action>
>({} as React.Dispatch<Action>);
export const useActionDispatchContext = () => useContext(ActionDispatchContext);

export const ActionContext = createContext<ReducerState>({} as ReducerState);
export const useActionContext = () => useContext(ActionContext);

export const ActionContextProvider = ActionContext.Provider;
export const ActionConsumer = ActionContext.Consumer;

const ActionProvider: SFC = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'Actions',
  );

  const { action } = useGlobalActionDispatch();

  useEffect(() => {
    console.log(action);
    if (!action) return;
    dispatch(action);
  }, [action]);

  return (
    <ActionContextProvider value={state}>
      <ActionDispatchContext.Provider value={dispatch}>
        {children}
      </ActionDispatchContext.Provider>
    </ActionContextProvider>
  );
};

export { ActionProvider };
