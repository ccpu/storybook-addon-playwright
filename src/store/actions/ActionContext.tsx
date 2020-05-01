import React, {
  createContext,
  SFC,
  useReducer,
  useEffect,
  useCallback,
} from 'react';
import { Loader } from '../../components/common';
import { StoryAction } from '../../typings';
import { useActionData } from '../../hooks';
import { initialState, reducer, ReducerState } from './reducer';
import { nanoid } from 'nanoid';

export interface ActionContextProps extends ReducerState {
  addStoryAction: (action: string) => void;
}

export const ActionContext = createContext<ActionContextProps>(
  {} as ActionContextProps,
);

export const ActionContextProvider = ActionContext.Provider;
export const ActionConsumer = ActionContext.Consumer;

const ActionProvider: SFC = (props) => {
  const { children } = props;

  const { actions, loading } = useActionData();

  const [state, dispatch] = useReducer(reducer, initialState);

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

  return (
    <ActionContextProvider
      value={{
        actionSchema: state.actionSchema,
        addStoryAction,
        storyActions: state.storyActions,
      }}
    >
      <Loader open={loading} />
      {children}
    </ActionContextProvider>
  );
};

export { ActionProvider };
