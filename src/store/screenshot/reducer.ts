import { ScreenshotData } from '../../typings';
// import { combineReducers } from '../../utils';

export interface ReducerState {
  screenshots: ScreenshotData[];
}

export type Action =
  | {
      type: 'setScreenshots';
      screenshots: ScreenshotData[];
    }
  | {
      type: 'addScreenshot';
      screenshot: ScreenshotData;
    }
  | { type: 'deleteScreenshot'; screenshotHash: string };

export const initialState: ReducerState = {
  screenshots: [],
};

export function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'addScreenshot': {
      return {
        ...state,
        screenshots: state.screenshots
          ? [...state.screenshots, action.screenshot]
          : [action.screenshot],
      };
    }
    case 'setScreenshots': {
      return {
        ...state,
        screenshots: action.screenshots,
      };
    }
    case 'deleteScreenshot': {
      return {
        ...state,
        screenshots: state.screenshots.filter(
          (x) => x.hash !== action.screenshotHash,
        ),
      };
    }
    default:
      return state;
  }
}

// export const reducer = combineReducers(mainReducer);
