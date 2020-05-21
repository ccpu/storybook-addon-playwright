import { ScreenshotData } from '../../typings';
import { combineReducers } from '../../utils';

export interface ReducerState {
  screenshots: ScreenshotData[];
}

export type Action = {
  type: 'setScreenshots';
  screenshots: ScreenshotData[];
};

export const initialState: ReducerState = {
  screenshots: [],
};

export function mainReducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'setScreenshots': {
      return {
        ...state,
        screenshots: action.screenshots,
      };
    }

    default:
      return state;
  }
}

export const reducer = combineReducers(mainReducer);
