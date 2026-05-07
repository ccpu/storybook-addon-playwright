import type { ImageDiffResult } from '../../../api/typings';
import type { ScreenshotData } from '../../../typings';
import { create } from 'zustand';

export interface ScreenshotState {
  screenshots: ScreenshotData[];
  imageDiffResults: ImageDiffResult[];
  pauseDeleteImageDiffResult: boolean;
}

export const initialScreenshotState: ScreenshotState = {
  imageDiffResults: [],
  pauseDeleteImageDiffResult: false,
  screenshots: [],
};

export const useScreenshotStore = create<ScreenshotState>(() => ({
  ...initialScreenshotState,
}));
