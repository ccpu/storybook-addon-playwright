import type { ImageDiffResult } from '../../../api/typings';
import type { ScreenshotData } from '../../../typings';
import type { ScreenshotState } from './screenshot-store';
import arrayMove from 'array-move';
import { useScreenshotStore } from './screenshot-store';

const getState = () => useScreenshotStore.getState();
function setState(
  partial:
    | Partial<ScreenshotState>
    | ((state: ScreenshotState) => Partial<ScreenshotState>),
) {
  return useScreenshotStore.setState(partial);
}

export function addScreenshot(screenshot: ScreenshotData) {
  const state = getState();
  const screenshots = state.screenshots
    ? [...state.screenshots, screenshot]
    : [screenshot];
  setState({ screenshots: [...screenshots] });
}

export function removeScreenshot(screenshotId: string) {
  const state = getState();
  setState({
    imageDiffResults: state.imageDiffResults
      ? state.imageDiffResults.filter((x) => x.screenshotId !== screenshotId)
      : [],
    screenshots: state.screenshots.filter((x) => x.id !== screenshotId),
  });
}

export function changeScreenshotIndex({
  oldIndex,
  newIndex,
}: {
  oldIndex: number;
  newIndex: number;
}) {
  const state = getState();
  setState({
    screenshots: [
      ...arrayMove(state.screenshots, oldIndex, newIndex).map((x, i) => {
        x.index = i;
        return x;
      }),
    ],
  });
}

export function removeStoryScreenshots() {
  setState({ screenshots: [] });
}

export function setScreenshots(screenshots: ScreenshotData[]) {
  setState({ screenshots });
}

export function setImageDiffResults(imageDiffResults: ImageDiffResult[]) {
  setState({ imageDiffResults });
}

export function addImageDiffResult(imageDiffResult: ImageDiffResult) {
  const state = getState();
  setState({
    imageDiffResults: [
      ...state.imageDiffResults.filter(
        (x) => x.screenshotId !== imageDiffResult.screenshotId,
      ),
      imageDiffResult,
    ],
  });
}

export function updateImageDiffResult(imageDiffResult: ImageDiffResult) {
  const state = getState();
  setState({
    imageDiffResults: state.imageDiffResults.map((result) => {
      if (result.screenshotId !== imageDiffResult.screenshotId) return result;
      return { ...result, ...imageDiffResult };
    }),
  });
}

export function setPauseDeleteImageDiffResult(paused: boolean) {
  setState({ pauseDeleteImageDiffResult: paused });
}

export function removeImageDiffResult(screenshotId: string) {
  const state = getState();
  if (state.pauseDeleteImageDiffResult) return;
  setState({
    imageDiffResults: state.imageDiffResults.filter(
      (x) => x.screenshotId !== screenshotId,
    ),
  });
}

export function removePassedImageDiffResult() {
  const state = getState();
  setState({
    imageDiffResults: state.imageDiffResults.filter((x) => !x.pass),
  });
}

export function deleteScreenshot(screenshotId: string) {
  const state = getState();
  setState({
    imageDiffResults: state.imageDiffResults.filter(
      (x) => x.screenshotId !== screenshotId,
    ),
    screenshots: state.screenshots.filter((x) => x.id !== screenshotId),
  });
}
