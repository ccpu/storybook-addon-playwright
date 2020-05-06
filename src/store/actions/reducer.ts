import { ActionSchema, StoryAction, ActionSet } from '../../typings';
import * as immutableObject from 'object-path-immutable';

export interface ReducerState {
  actionSchema: ActionSchema;
  storyActions: StoryAction[];
  expandedActions: { [k: string]: boolean };
  actionSets: ActionSet[];
  currentActionSetId?: string;
}

export type Action =
  | {
      type: 'addActionSet';
      actionSetId: string;
      description: string;
      storyId: string;
    }
  | { type: 'setActionSchema'; actionSchema: ActionSchema }
  | { type: 'setStoryActions'; actions: StoryAction[] }
  | { type: 'toggleActionExpansion'; actionId: string }
  | { type: 'toggleSubtitleItem'; actionId: string; actionOptionPath: string }
  | {
      type: 'removeFromActionTitle';
      actionId: string;
      actionOptionPath: string;
    }
  | { type: 'clearActionExpansion' }
  | {
      type: 'setActionOptions';
      actionId: string;
      objPath: string;
      val: unknown;
    }
  | { type: 'addStoryAction'; action: StoryAction };

export const initialState: ReducerState = {
  actionSchema: {},
  actionSets: [],
  expandedActions: {},
  storyActions: [],
};

export function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'addActionSet': {
      return {
        ...state,
        actionSets: [
          ...state.actionSets,
          {
            actions: [],
            description: action.description,
            id: action.actionSetId,
            storyId: action.storyId,
          },
        ],
        currentActionSetId: action.actionSetId,
      };
    }
    case 'toggleSubtitleItem': {
      return {
        ...state,
        storyActions: state.storyActions.map((act) => {
          if (act.id === action.actionId) {
            const hasItem =
              act.subtitleItems &&
              act.subtitleItems.find((x) => x === action.actionOptionPath);
            return {
              ...act,
              subtitleItems:
                hasItem && act.subtitleItems
                  ? act.subtitleItems.filter(
                      (x) => x !== action.actionOptionPath,
                    )
                  : [...(act.subtitleItems || []), action.actionOptionPath],
            };
          }
          return act;
        }),
      };
    }
    case 'removeFromActionTitle': {
      return {
        ...state,
        storyActions: state.storyActions.map((act) => {
          if (act.id === action.actionId) {
            return {
              ...act,
              subtitleItems:
                act.subtitleItems &&
                act.subtitleItems.filter((x) => x !== action.actionOptionPath),
            };
          }
          return act;
        }),
      };
    }
    case 'toggleActionExpansion': {
      const expand = state.expandedActions[action.actionId] === true;

      return {
        ...state,
        expandedActions: {
          ...state.expandedActions,
          [action.actionId]: !expand,
        },
      };
    }
    case 'clearActionExpansion': {
      return {
        ...state,
        expandedActions: {},
      };
    }
    case 'setActionSchema':
      return { ...state, actionSchema: action.actionSchema };
    case 'addStoryAction':
      return { ...state, storyActions: [...state.storyActions, action.action] };
    case 'setActionOptions': {
      return {
        ...state,
        storyActions: state.storyActions.map((act) => {
          if (act.id === action.actionId) {
            return {
              ...act,
              action: immutableObject.set(
                act.action,
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
