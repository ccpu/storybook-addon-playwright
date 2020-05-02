import { ActionSchema, StoryAction } from '../../typings';
import * as immutableObject from 'object-path-immutable';

export interface ReducerState {
  actionSchema: ActionSchema;
  storyActions: StoryAction[];
}

export type Action =
  | { type: 'setActionSchema'; actions: ActionSchema }
  | { type: 'setStoryActions'; actions: StoryAction[] }
  | {
      type: 'setActionOptions';
      actionId: string;
      objPath: string;
      val: unknown;
    }
  | { type: 'addStoryAction'; action: StoryAction };

export const initialState: ReducerState = {
  actionSchema: {},
  storyActions: [],
};

export function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'setActionSchema':
      return { ...state, actionSchema: action.actions };
    case 'addStoryAction':
      return { ...state, storyActions: [...state.storyActions, action.action] };
    case 'setActionOptions': {
      return {
        ...state,
        storyActions: state.storyActions.map((act) => {
          if (act.id === action.actionId) {
            return {
              ...act,
              actions: immutableObject.set(
                act.actions,
                action.objPath,
                action.val,
              ),
            };
          }
          return act;
        }),
      };
    }
    default:
      throw new Error();
  }
}
