import { StoryAction, ActionSet, ActionSchemaList } from '../../typings';
import * as immutableObject from 'object-path-immutable';
import arrayMove from 'array-move';

export interface ReducerState {
  actionSchema: ActionSchemaList;
  expandedActions: { [k: string]: boolean };
  actionSets: ActionSet[];
  editorActionSet?: ActionSet;
  initialised: boolean;
  currentActionSets: string[];
}

export type Action =
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
      type: 'sortActionSets';
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
  | {
      type: 'clearEditorActionSet';
    }
  | {
      type: 'setEditorActionSet';
      actionSet: ActionSet;
    }
  | {
      type: 'saveEditorActionSet';
      actionSet: ActionSet;
    }
  | {
      type: 'toggleCurrentActionSet';
      actionSetId: string;
    }
  | { type: 'setEditorActionDescription'; description: string }
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
  | { type: 'addActionSetAction'; action: StoryAction };

export const initialState: ReducerState = {
  actionSchema: {},
  actionSets: [],
  currentActionSets: [],
  expandedActions: {},
  initialised: true,
};

export const combineReducers = (...reducers) => (prevState, value) =>
  reducers.reduce((newState, reducer) => reducer(newState, value), prevState);

export function mainReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'addActionSetList': {
      return {
        ...state,
        actionSets: [...state.actionSets, ...action.actionSets],
      };
    }
    case 'deleteActionSet': {
      return {
        ...state,
        actionSets: state.actionSets.filter((x) => x.id !== action.actionSetId),
      };
    }

    case 'sortActionSets': {
      return {
        ...state,
        actionSets: [
          ...arrayMove(state.actionSets, action.oldIndex, action.newIndex),
        ],
      };
    }
    case 'toggleCurrentActionSet': {
      const isCurrent = state.currentActionSets.find(
        (x) => x === action.actionSetId,
      );
      return {
        ...state,
        currentActionSets: isCurrent
          ? state.currentActionSets.filter((x) => x !== action.actionSetId)
          : [...state.currentActionSets, action.actionSetId],
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

    default:
      return state;
  }
}

export function actionReducer(
  state: ReducerState,
  action: Action,
): ReducerState {
  switch (action.type) {
    case 'clearEditorActionSet': {
      return {
        ...state,
        editorActionSet: undefined,
      };
    }

    case 'setEditorActionSet': {
      return {
        ...state,
        editorActionSet: action.actionSet,
      };
    }

    case 'setEditorActionDescription': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          description: action.description,
        },
      };
    }

    case 'saveEditorActionSet': {
      return {
        ...state,
        actionSets: [
          ...state.actionSets.filter((x) => x.id !== action.actionSet.id),
          action.actionSet,
        ],
      };
    }

    case 'toggleSubtitleItem': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: state.editorActionSet.actions.map((act) => {
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
        },
      };
    }
    case 'removeFromActionTitle': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: state.editorActionSet.actions.map((act) => {
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
        },
      };
    }
    case 'moveActionSetAction': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: [
            ...arrayMove(
              state.editorActionSet.actions,
              action.oldIndex,
              action.newIndex,
            ),
          ],
        },
      };
    }
    case 'deleteActionSetAction': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: state.editorActionSet.actions.filter(
            (x) => x.id !== action.actionId,
          ),
        },
      };
    }

    case 'addActionSetAction':
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: [...state.editorActionSet.actions, action.action],
        },
      };
    case 'setActionOptions': {
      return {
        ...state,
        editorActionSet: {
          ...state.editorActionSet,
          actions: state.editorActionSet.actions.map((act) => {
            if (act.id === action.actionId) {
              return {
                ...act,
                args: immutableObject.set(act.args, action.objPath, action.val),
              };
            }
            return act;
          }),
        },
      };
    }
    default:
      return state;
  }
}

export const reducer = combineReducers(mainReducer, actionReducer);
