import React, { createContext, useContext } from 'react';
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

const ActionProvider: React.FC = (props) => {
  const { children } = props;

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'Actions',
  );

  useGlobalActionDispatch((action) => {
    dispatch(action);
  });

  return (
    <ActionContextProvider value={state}>
      <ActionDispatchContext.Provider value={dispatch}>
        {children}
      </ActionDispatchContext.Provider>
    </ActionContextProvider>
  );
};

export { ActionProvider };
