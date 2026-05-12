import type { ImageDiffResult } from '../../../api/typings';
import type { ScreenshotData } from '../../../typings';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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

export const useScreenshotStore = create<ScreenshotState>()(
  devtools(
    () => ({
      ...initialScreenshotState,
    }),
    { name: 'screenshot-store' },
  ),
);
