import type { ScreenshotState } from './screenshot-store';
import { useScreenshotStore } from './screenshot-store';

export function getScreenshotState(): ScreenshotState {
  return useScreenshotStore.getState();
}

export function useScreenshots() {
  return useScreenshotStore((s) => s.screenshots);
}

export function useImageDiffResults() {
  return useScreenshotStore((s) => s.imageDiffResults);
}

export function usePauseDeleteImageDiffResult() {
  return useScreenshotStore((s) => s.pauseDeleteImageDiffResult);
}

export function useScreenshotStoreState() {
  return useScreenshotStore();
}
