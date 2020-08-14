import {
  StoryAction,
  PlaywrightDataStories,
  ActionSchemaList,
  ActionSet,
} from '../../typings';
import * as immutableObject from 'object-path-immutable';
import arrayMove from 'array-move';
import { combineReducers } from '../../utils';
import { nanoid } from 'nanoid';
import { isSameActions } from './utils';

export interface ReducerState {
  actionSchema: ActionSchemaList;
  expandedActions: { [k: string]: boolean };
  stories: PlaywrightDataStories;
  initialised: boolean;
  currentActionSets: string[];
  orgEditingActionSet?: ActionSet & { isNew?: boolean };
}

export type Action =
  | {
      type: 'deleteActionSetAction';
      actionId: string;
      actionSetId: string;
      storyId: string;
    }
  | {
      type: 'moveActionSetAction';
      oldIndex: number;
      newIndex: number;
      actionSetId: string;
      storyId: string;
    }
  | {
      type: 'sortActionSets';
      oldIndex: number;
      newIndex: number;
      storyId: string;
    }
  | {
      type: 'addActionSetList';
      actionSets: ActionSet[];
      storyId: string;
    }
  | {
      type: 'setScreenShotActionSets';
      actionSets: ActionSet[];
      storyId: string;
    }
  | {
      type: 'setCurrentActionSets';
      actionSetIds: string[];
    }
  | {
      type: 'addActionSet';
      actionSet: ActionSet;
      storyId: string;
      selected: boolean;
      new?: boolean;
    }
  | {
      type: 'deleteActionSet';
      actionSetId: string;
      storyId: string;
    }
  | {
      type: 'deleteTempActionSets';
      storyId: string;
    }
  | {
      type: 'clearCurrentActionSets';
    }
  | {
      type: 'saveActionSet';
      actionSet: ActionSet;
      storyId: string;
    }
  | {
      type: 'toggleCurrentActionSet';
      actionSetId: string;
    }
  | {
      type: 'setActionSetTitle';
      title: string;
      storyId: string;
      actionSetId: string;
    }
  | { type: 'setActionSchema'; actionSchema: ActionSchemaList }
  | { type: 'toggleActionExpansion'; actionId: string }
  | {
      type: 'toggleSubtitleItem';
      actionId: string;
      actionOptionPath: string;
      storyId: string;
      actionSetId: string;
    }
  | { type: 'clearActionExpansion' }
  | {
      type: 'setActionOptions';
      actionId: string;
      objPath: string;
      val: unknown;
      storyId: string;
      actionSetId: string;
    }
  | {
      type: 'cancelEditActionSet';
      storyId: string;
    }
  | {
      type: 'addActionSetAction';
      action: StoryAction;
      storyId: string;
      actionSetId: string;
    }
  | {
      type: 'editActionSet';
      actionSet: ActionSet;
    };

export const initialState: ReducerState = {
  actionSchema: {},
  currentActionSets: [],
  expandedActions: {},
  initialised: true,
  stories: {},
};

const updateStoryActionSet = (
  state: ReducerState,
  storyId: string,
  actionSets: ActionSet[],
): ReducerState => {
  return {
    ...state,
    stories: {
      ...state.stories,
      [storyId]: {
        ...state.stories[storyId],
        actionSets: actionSets,
      },
    },
  };
};

function updateStoryEditingActionSet(
  state: ReducerState,
  storyId: string,
  actionSetId: string,
  actionSet: (actionSet: ActionSet) => ActionSet,
): ReducerState {
  return {
    ...state,
    stories: {
      ...state.stories,
      [storyId]: {
        ...state.stories[storyId],
        actionSets: state.stories[storyId].actionSets.map((act) => {
          if (act.id !== actionSetId) return act;
          const newAct = actionSet(act);
          return newAct;
        }),
      },
    },
  };
}

const deleteActionSet = (
  state: ReducerState,
  storyId: string,
  actionSetId: string,
): ReducerState => {
  const newState = updateStoryActionSet(
    state,
    storyId,
    state.stories[storyId].actionSets.filter((x) => x.id !== actionSetId),
  );

  return {
    ...state,
    ...newState,
    orgEditingActionSet: undefined,
  };
};

export function mainReducer(
  state: ReducerState = initialState,
  action: Action,
): ReducerState {
  switch (action.type) {
    case 'addActionSetList': {
      return updateStoryActionSet(state, action.storyId, action.actionSets);
    }

    case 'setScreenShotActionSets': {
      const storyActionSets = state.stories[action.storyId].actionSets;
      const actionSets = action.actionSets.reduce((arr, actionSet) => {
        if (storyActionSets) {
          const storyActionSet = storyActionSets.find((x) => {
            if (isSameActions(x.actions, actionSet.actions)) {
              return true;
            }
            return false;
          });
          if (storyActionSet) {
            arr.push(storyActionSet);
          } else {
            arr.push({
              ...actionSet,
              actions: actionSet.actions.map((action) => {
                action.id = nanoid(12);
                return action;
              }),
              id: nanoid(12),
              temp: true,
            });
          }
        }
        return arr;
      }, [] as ActionSet[]);

      const currentActionSets: string[] = actionSets.map((x) => x.id);

      const newState = updateStoryActionSet(state, action.storyId, [
        ...actionSets,
        ...storyActionSets.filter(
          (x) => currentActionSets.indexOf(x.id) === -1,
        ),
      ]);

      return {
        ...state,
        ...newState,
        currentActionSets,
      };
    }

    case 'addActionSet': {
      const newState = updateStoryActionSet(state, action.storyId, [
        ...(state.stories[action.storyId]
          ? state.stories[action.storyId].actionSets.filter(
              (x) => x.id !== action.actionSet.id,
            )
          : []),
        action.actionSet,
      ]);

      return {
        ...state,
        ...newState,
        currentActionSets: action.selected
          ? [
              ...(state.currentActionSets ? state.currentActionSets : []),
              action.actionSet.id,
            ]
          : state.currentActionSets,
        orgEditingActionSet: action.new
          ? { ...action.actionSet, isNew: true }
          : undefined,
      };
    }
    case 'setCurrentActionSets': {
      return {
        ...state,
        currentActionSets: action.actionSetIds,
      };
    }
    case 'clearCurrentActionSets': {
      return {
        ...state,
        currentActionSets: [],
      };
    }

    case 'deleteActionSet': {
      return deleteActionSet(state, action.storyId, action.actionSetId);
    }

    case 'deleteTempActionSets': {
      return updateStoryActionSet(
        state,
        action.storyId,
        state.stories[action.storyId].actionSets.filter((x) => !x.temp),
      );
    }

    case 'sortActionSets': {
      return updateStoryActionSet(state, action.storyId, [
        ...arrayMove(
          state.stories[action.storyId].actionSets,
          action.oldIndex,
          action.newIndex,
        ),
      ]);
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
  state: ReducerState = initialState,
  action: Action,
): ReducerState {
  switch (action.type) {
    case 'cancelEditActionSet': {
      if (!state.orgEditingActionSet) return state;

      const { isNew, ...rest } = state.orgEditingActionSet;

      if (isNew) {
        return deleteActionSet(
          state,
          action.storyId,
          state.orgEditingActionSet.id,
        );
      } else {
        const newState = updateStoryEditingActionSet(
          state,
          action.storyId,
          state.orgEditingActionSet.id,
          (actionSet) => ({ ...actionSet, ...rest }),
        );
        return {
          ...newState,
          orgEditingActionSet: undefined,
        };
      }
    }

    case 'editActionSet': {
      return {
        ...state,
        currentActionSets: [...state.currentActionSets, action.actionSet.id],
        orgEditingActionSet: action.actionSet,
      };
    }

    case 'setActionSetTitle': {
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => ({ ...actionSet, title: action.title }),
      );
    }

    case 'addActionSetAction':
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => {
          return {
            ...actionSet,
            actions: [...actionSet.actions, action.action],
          };
        },
      );

    case 'toggleSubtitleItem': {
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => ({
          ...actionSet,
          actions: actionSet.actions.map((act) => {
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
        }),
      );
    }
    case 'moveActionSetAction': {
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => ({
          ...actionSet,
          actions: [
            ...arrayMove(actionSet.actions, action.oldIndex, action.newIndex),
          ],
        }),
      );
    }
    case 'deleteActionSetAction': {
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => ({
          ...actionSet,
          actions: actionSet.actions.filter((x) => x.id !== action.actionId),
        }),
      );
    }

    case 'setActionOptions': {
      return updateStoryEditingActionSet(
        state,
        action.storyId,
        action.actionSetId,
        (actionSet) => ({
          ...actionSet,
          actions: actionSet.actions.map((act) => {
            if (act.id === action.actionId) {
              return {
                ...act,
                args: immutableObject.set(act.args, action.objPath, action.val),
              };
            }
            return act;
          }),
        }),
      );
    }

    case 'saveActionSet': {
      return {
        ...state,
        orgEditingActionSet: undefined,
      };
    }

    default:
      return state;
  }
}

export const reducer = combineReducers(mainReducer, actionReducer);
