import { StoryAction, ActionSchemaList, ActionSet } from '../../../typings';
import * as immutableObject from 'object-path-immutable';
import arrayMove from 'array-move';
import { nanoid } from 'nanoid';
import { isSameActions } from './utils/index';
import { useActionSetStore, ActionSetState } from './action-set-store';

const getState = () => useActionSetStore.getState();
const setState = (
  partial:
    | Partial<ActionSetState>
    | ((state: ActionSetState) => Partial<ActionSetState>),
) => useActionSetStore.setState(partial);

// --- helpers ---

function updateStoryActionSet(
  state: ActionSetState,
  storyId: string,
  actionSets: ActionSet[],
): Partial<ActionSetState> {
  return {
    stories: {
      ...state.stories,
      [storyId]: {
        ...state.stories[storyId],
        actionSets,
      },
    },
  };
}

function updateStoryEditingActionSet(
  state: ActionSetState,
  storyId: string,
  actionSetId: string,
  updater: (actionSet: ActionSet) => ActionSet,
): Partial<ActionSetState> {
  return {
    stories: {
      ...state.stories,
      [storyId]: {
        ...state.stories[storyId],
        actionSets: state.stories[storyId].actionSets.map((act) => {
          if (act.id !== actionSetId) return act;
          return updater(act);
        }),
      },
    },
  };
}

function removeActionSet(
  state: ActionSetState,
  storyId: string,
  actionSetId: string,
): Partial<ActionSetState> {
  const updated = updateStoryActionSet(
    state,
    storyId,
    state.stories[storyId].actionSets.filter((x) => x.id !== actionSetId),
  );
  return {
    ...updated,
    orgEditingActionSet: undefined,
  };
}

// --- public actions ---

export function addActionSetList({
  storyId,
  actionSets,
}: {
  storyId: string;
  actionSets: ActionSet[];
}) {
  const state = getState();
  setState(updateStoryActionSet(state, storyId, actionSets));
}

export function setScreenShotActionSets({
  storyId,
  actionSets,
}: {
  storyId: string;
  actionSets: ActionSet[];
}) {
  const state = getState();
  const storyActionSets = state.stories[storyId].actionSets;

  const matched = actionSets.reduce((arr, actionSet) => {
    if (storyActionSets) {
      let storyActionSet: ActionSet = undefined;

      for (let i = 0; i < storyActionSets.length; i++) {
        const act = storyActionSets[i];

        if (arr.find((x) => x.id === act.id)) continue;

        if (isSameActions(act.actions, actionSet.actions)) {
          storyActionSet = act;
          break;
        }
      }

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

  const currentActionSets: string[] = matched.map((x) => x.id);

  const updated = updateStoryActionSet(state, storyId, [
    ...matched,
    ...storyActionSets.filter((x) => currentActionSets.indexOf(x.id) === -1),
  ]);

  setState({
    ...updated,
    currentActionSets,
  });
}

export function addActionSet({
  storyId,
  actionSet,
  selected,
  isNew,
}: {
  storyId: string;
  actionSet: ActionSet;
  selected: boolean;
  isNew?: boolean;
}) {
  const state = getState();
  const newAction = [
    ...(state.stories[storyId]
      ? state.stories[storyId].actionSets.filter((x) => x.id !== actionSet.id)
      : []),
    actionSet,
  ];

  const updated = updateStoryActionSet(state, storyId, newAction);

  setState({
    ...updated,
    currentActionSets: selected
      ? [
          ...(state.currentActionSets ? state.currentActionSets : []),
          actionSet.id,
        ]
      : state.currentActionSets,
    orgEditingActionSet: isNew ? { ...actionSet, isNew: true } : undefined,
  });
}

export function setCurrentActionSets(actionSetIds: string[]) {
  setState({ currentActionSets: actionSetIds });
}

export function clearCurrentActionSets() {
  setState({ currentActionSets: [] });
}

export function deleteActionSet({
  storyId,
  actionSetId,
}: {
  storyId: string;
  actionSetId: string;
}) {
  const state = getState();
  setState(removeActionSet(state, storyId, actionSetId));
}

export function deleteTempActionSets(storyId: string) {
  const state = getState();
  if (!state.stories[storyId] || !state.stories[storyId].actionSets) {
    return;
  }

  setState(
    updateStoryActionSet(
      state,
      storyId,
      state.stories[storyId].actionSets.filter((x) => !x.temp),
    ),
  );
}

export function sortActionSets({
  storyId,
  oldIndex,
  newIndex,
}: {
  storyId: string;
  oldIndex: number;
  newIndex: number;
}) {
  const state = getState();
  setState(
    updateStoryActionSet(state, storyId, [
      ...arrayMove(state.stories[storyId].actionSets, oldIndex, newIndex),
    ]),
  );
}

export function toggleCurrentActionSet(actionSetId: string) {
  const state = getState();
  const isCurrent = state.currentActionSets.find((x) => x === actionSetId);
  setState({
    currentActionSets: isCurrent
      ? state.currentActionSets.filter((x) => x !== actionSetId)
      : [...state.currentActionSets, actionSetId],
  });
}

export function toggleActionExpansion(actionId: string) {
  const state = getState();
  const expand = state.expandedActions[actionId] === true;
  setState({
    expandedActions: {
      ...state.expandedActions,
      [actionId]: !expand,
    },
  });
}

export function clearActionExpansion() {
  setState({ expandedActions: {} });
}

export function setActionSchema(actionSchema: ActionSchemaList) {
  setState({ actionSchema });
}

export function cancelEditActionSet(storyId: string) {
  const state = getState();
  if (!state.orgEditingActionSet) return;

  const { isNew, ...rest } = state.orgEditingActionSet;

  if (isNew) {
    setState(removeActionSet(state, storyId, state.orgEditingActionSet.id));
  } else {
    const updated = updateStoryEditingActionSet(
      state,
      storyId,
      state.orgEditingActionSet.id,
      (actionSet) => ({ ...actionSet, ...rest }),
    );
    setState({
      ...updated,
      orgEditingActionSet: undefined,
    });
  }
}

export function editActionSet(actionSet: ActionSet) {
  const state = getState();
  setState({
    currentActionSets: [...state.currentActionSets, actionSet.id],
    orgEditingActionSet: actionSet,
  });
}

export function setActionSetTitle({
  storyId,
  actionSetId,
  title,
}: {
  storyId: string;
  actionSetId: string;
  title: string;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      title,
    })),
  );
}

export function addActionSetAction({
  storyId,
  actionSetId,
  action,
}: {
  storyId: string;
  actionSetId: string;
  action: StoryAction;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      actions: [...actionSet.actions, action],
    })),
  );
}

export function toggleSubtitleItem({
  storyId,
  actionSetId,
  actionId,
  actionOptionPath,
}: {
  storyId: string;
  actionSetId: string;
  actionId: string;
  actionOptionPath: string;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      actions: actionSet.actions.map((act) => {
        if (act.id === actionId) {
          const hasItem =
            act.subtitleItems &&
            act.subtitleItems.find((x) => x === actionOptionPath);
          return {
            ...act,
            subtitleItems:
              hasItem && act.subtitleItems
                ? act.subtitleItems.filter((x) => x !== actionOptionPath)
                : [...(act.subtitleItems || []), actionOptionPath],
          };
        }
        return act;
      }),
    })),
  );
}

export function moveActionSetAction({
  storyId,
  actionSetId,
  oldIndex,
  newIndex,
}: {
  storyId: string;
  actionSetId: string;
  oldIndex: number;
  newIndex: number;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      actions: [...arrayMove(actionSet.actions, oldIndex, newIndex)],
    })),
  );
}

export function deleteActionSetAction({
  storyId,
  actionSetId,
  actionId,
}: {
  storyId: string;
  actionSetId: string;
  actionId: string;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      actions: actionSet.actions.filter((x) => x.id !== actionId),
    })),
  );
}

export function setActionOptions({
  storyId,
  actionSetId,
  actionId,
  objPath,
  val,
}: {
  storyId: string;
  actionSetId: string;
  actionId: string;
  objPath: string;
  val: unknown;
}) {
  const state = getState();
  setState(
    updateStoryEditingActionSet(state, storyId, actionSetId, (actionSet) => ({
      ...actionSet,
      actions: actionSet.actions.map((act) => {
        if (act.id === actionId) {
          return {
            ...act,
            args: immutableObject.set(act.args, objPath, val),
          };
        }
        return act;
      }),
    })),
  );
}

export function saveActionSet() {
  setState({ orgEditingActionSet: undefined });
}
