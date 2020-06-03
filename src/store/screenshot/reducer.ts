import { ScreenshotData } from '../../typings';
import { ImageDiffResult } from '../../api/typings';
import arrayMove from 'array-move';

export interface ReducerState {
  screenshots: ScreenshotData[];
  imageDiffResults: ImageDiffResult[];
  pauseDeleteImageDiffResult: boolean;
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
      screenshotHash: string;
    }
  | {
      type: 'updateImageDiffResult';
      imageDiffResult: ImageDiffResult;
    }
  | {
      type: 'addScreenshot';
      screenshot: ScreenshotData;
    }
  | {
      type: 'removeScreenshot';
      screenshotHash: string;
    }
  | {
      type: 'removeStoryScreenshots';
    }
  | {
      type: 'changeIndex';
      oldIndex: number;
      newIndex: number;
    }
  | {
      type: 'pauseDeleteImageDiffResult';
      state: boolean;
    }
  | { type: 'deleteScreenshot'; screenshotHash: string };

export const initialState: ReducerState = {
  imageDiffResults: [],
  pauseDeleteImageDiffResult: false,
  screenshots: [],
};

export function reducer(state: ReducerState, action: Action): ReducerState {
  switch (action.type) {
    case 'addScreenshot': {
      const screenshots = state.screenshots
        ? [...state.screenshots, action.screenshot]
        : [action.screenshot];

      return {
        ...state,
        screenshots: [...screenshots],
      };
    }
    case 'removeScreenshot': {
      return {
        ...state,
        screenshots: state.screenshots.filter(
          (x) => x.hash !== action.screenshotHash,
        ),
      };
    }
    case 'changeIndex': {
      return {
        ...state,
        screenshots: [
          ...arrayMove(
            state.screenshots,

            action.oldIndex,
            action.newIndex,
          ).map((x, i) => {
            x.index = i;
            return x;
          }),
        ],
      };
    }
    case 'removeStoryScreenshots': {
      return {
        ...state,
        screenshots: [],
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
    case 'updateImageDiffResult': {
      return {
        ...state,
        imageDiffResults: state.imageDiffResults.map((result) => {
          if (result.screenshotHash !== action.imageDiffResult.screenshotHash)
            return result;
          console.log(action.imageDiffResult);
          return { ...action.imageDiffResult };
        }),
      };
    }
    case 'pauseDeleteImageDiffResult': {
      return {
        ...state,
        pauseDeleteImageDiffResult: action.state,
      };
    }
    case 'removeImageDiffResult': {
      if (state.pauseDeleteImageDiffResult) return state;
      return {
        ...state,
        imageDiffResults: state.imageDiffResults.filter(
          (x) => x.screenshotHash !== action.screenshotHash,
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
