import { create } from 'zustand';
import { ScreenshotData } from '../../../typings';
import { ImageDiffResult } from '../../../api/typings';

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
