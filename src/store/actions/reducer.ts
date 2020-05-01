import { ActionSchema, StoryAction } from '../../typings';

export interface ReducerState {
  actionSchema: ActionSchema;
  storyActions: StoryAction[];
}

type Action =
  | { type: 'setActionSchema'; actions: ActionSchema }
  | { type: 'setStoryActions'; actions: StoryAction[] }
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
    default:
      throw new Error();
  }
}
