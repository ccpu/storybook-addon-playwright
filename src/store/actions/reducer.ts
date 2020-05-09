import { StoryAction, ActionSet, ActionSchemaList } from '../../typings';
import * as immutableObject from 'object-path-immutable';
import arrayMove from 'array-move';

export interface ReducerState {
  actionSchema: ActionSchemaList;
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
  | {
      type: 'removeActionSet';
      actionSetId: string;
    }
  | {
      type: 'deleteActionSetAction';
      actionId: string;
    }
  | {
      type: 'moveActionSetAction';
      oldIndex: number;
      newIndex: number;
    }
  | {
      type: 'addActionSetList';
      actionSets: ActionSet[];
    }
  | {
      type: 'deleteActionSet';
      actionSetId: string;
    }
  | { type: 'setActionSchema'; actionSchema: ActionSchemaList }
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
    case 'removeActionSet': {
      return {
        ...state,
        actionSets: state.actionSets.filter((x) => x.id !== action.actionSetId),
        currentActionSetId: undefined,
      };
    }
    case 'addActionSetList': {
      return {
        ...state,
        actionSets: [...state.actionSets, ...action.actionSets],
        currentActionSetId: undefined,
      };
    }
    case 'deleteActionSet': {
      return {
        ...state,
        actionSets: state.actionSets.filter((x) => x.id !== action.actionSetId),
        currentActionSetId: undefined,
      };
    }
    case 'toggleSubtitleItem': {
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: set.actions.map((act) => {
                if (act.id === action.actionId) {
                  const hasItem =
                    act.subtitleItems &&
                    act.subtitleItems.find(
                      (x) => x === action.actionOptionPath,
                    );
                  return {
                    ...act,
                    subtitleItems:
                      hasItem && act.subtitleItems
                        ? act.subtitleItems.filter(
                            (x) => x !== action.actionOptionPath,
                          )
                        : [
                            ...(act.subtitleItems || []),
                            action.actionOptionPath,
                          ],
                  };
                }
                return act;
              }),
            };
          }
          return set;
        }),
      };
    }
    case 'removeFromActionTitle': {
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: set.actions.map((act) => {
                if (act.id === action.actionId) {
                  return {
                    ...act,
                    subtitleItems:
                      act.subtitleItems &&
                      act.subtitleItems.filter(
                        (x) => x !== action.actionOptionPath,
                      ),
                  };
                }
                return act;
              }),
            };
          }
          return set;
        }),
      };
    }
    case 'moveActionSetAction': {
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: [
                ...arrayMove(set.actions, action.oldIndex, action.newIndex),
              ],
            };
          }
          return set;
        }),
      };
    }
    case 'deleteActionSetAction': {
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: set.actions.filter((x) => x.id !== action.actionId),
            };
          }
          return set;
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
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: [...set.actions, action.action],
            };
          }
          return set;
        }),
      };
    case 'setActionOptions': {
      return {
        ...state,
        actionSets: state.actionSets.map((set) => {
          if (set.id === state.currentActionSetId) {
            return {
              ...set,
              actions: set.actions.map((act) => {
                if (act.id === action.actionId) {
                  return {
                    ...act,
                    args: immutableObject.set(
                      act.args,
                      action.objPath,
                      action.val,
                    ),
                  };
                }
                return act;
              }),
            };
          }
          return set;
        }),
      };
    }
    default:
      throw new Error();
  }
}
