import React, { createContext, SFC, useEffect, useCallback } from 'react';
import { Loader } from '../../components/common';
import { StoryAction } from '../../typings';
import { useActionData } from '../../hooks';
import { initialState, reducer, ReducerState } from './reducer';
import { nanoid } from 'nanoid';
import { useReducer } from 'reinspect';
import * as immutableObject from 'object-path-immutable';

export interface ActionContextProps {
  state: ReducerState;
  addStoryAction: (action: string) => void;
  setActionOptions: (actionId: string, objPath: string, val: unknown) => void;
  getActionOptionValue: (actionId: string, actionName, objPath: string) => void;
}

export const ActionContext = createContext<ActionContextProps>(
  {} as ActionContextProps,
);

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

  const addStoryAction = useCallback((actionSchemaKey: string) => {
    const newAction: StoryAction = {
      id: nanoid(10),
      schemaKey: actionSchemaKey,
    };
    dispatch({ action: newAction, type: 'addStoryAction' });
  }, []);

  const setActionOptions = useCallback(
    (actionId: string, objPath: string, val: unknown) => {
      dispatch({ actionId, objPath, type: 'setActionOptions', val });
    },
    [],
  );

  const getActionOptionValue = useCallback(
    (actionId: string, actionName: string, objectPath: string) => {
      const action = state.storyActions.find((x) => x.id === actionId);
      if (!action || !action.actions || !action.actions[actionName])
        return undefined;
      const val = immutableObject.get(action.actions[actionName], objectPath);
      return val;
    },
    [state.storyActions],
  );

  return (
    <ActionContextProvider
      value={{
        addStoryAction,
        getActionOptionValue,
        setActionOptions,
        state,
      }}
    >
      <Loader open={loading} />
      {children}
    </ActionContextProvider>
  );
};

export { ActionProvider };
