import React, { createContext, SFC, useEffect, useContext } from 'react';
import { Loader } from '../../components/common';
import { useActionSchema } from '../../hooks';
import { initialState, reducer, ReducerState, Action } from './reducer';
import { useReducer } from 'reinspect';

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

  const { actionSchema, loading } = useActionSchema();

  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    () => initialState,
    'ActionProvider',
  );

  useEffect(() => {
    dispatch({ actionSchema: actionSchema, type: 'setActionSchema' });
  }, [actionSchema]);

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
