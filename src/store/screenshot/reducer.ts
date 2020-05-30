import { ScreenshotData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';

export interface ReducerState {
  screenshots: ScreenshotData[];
  imageDiffResults: ImageDiffResult[];
}

export type Action =
  | {
      type: 'setScreenshots';
      screenshots: ScreenshotData[];
    }
  | {
      type: 'setImageDiffResults';
      imageDiffResults: ImageDiffResult[];
    }
  | {
      type: 'addImageDiffResult';
      imageDiffResult: ImageDiffResult;
    }
  | {
      type: 'removeImageDiffResult';
      imageDiffResult: ImageDiffResult;
    }
  | {
      type: 'addScreenshot';
      screenshot: ScreenshotData;
    }
  | { type: 'deleteScreenshot'; screenshotHash: string };

export const initialState: ReducerState = {
  imageDiffResults: [],
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
    case 'setImageDiffResults': {
      return {
        ...state,
        imageDiffResults: action.imageDiffResults,
      };
    }
    case 'addImageDiffResult': {
      return {
        ...state,
        imageDiffResults: [
          ...state.imageDiffResults.filter(
            (x) => x.screenshotHash !== action.imageDiffResult.screenshotHash,
          ),
          action.imageDiffResult,
        ],
      };
    }
    case 'removeImageDiffResult': {
      return {
        ...state,
        imageDiffResults: state.imageDiffResults.filter(
          (x) => x !== action.imageDiffResult,
        ),
      };
    }
    case 'deleteScreenshot': {
      return {
        ...state,
        imageDiffResults: state.imageDiffResults.filter(
          (x) => x !== action.screenshotHash,
        ),
        screenshots: state.screenshots.filter(
          (x) => x.hash !== action.screenshotHash,
        ),
      };
    }
    default:
      return state;
  }
}
