import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AddonState,
  ScreenshotOptions,
  ScreenshotTestTargetType,
  ScreenshotData,
  BrowserContextOptions,
} from '../typings';
import { SelectorState } from '../typings/selector';

export interface BrowsersOption {
  chromium?: BrowserContextOptions;
  firefox?: BrowserContextOptions;
  webkit?: BrowserContextOptions;
  all?: BrowserContextOptions;
}

export type BrowsersOptionTypes = keyof BrowsersOption;

export type SelectorType = 'selector' | 'position' | 'id-selector';

export interface SelectorManageSharedProps {
  type?: SelectorType;
  onData?: (data: SelectorState) => void;
  onStop?: () => void;
}

export interface SelectorManger extends SelectorManageSharedProps {
  start: boolean;
}

export interface EditScreenshotState {
  storyId: string;
  screenshotData: ScreenshotData;
  currentScreenshotOptions?: ScreenshotOptions;
  currentBrowserOptions?: BrowserContextOptions;
}

export interface ScreenshotUpdateOptions {
  inProgress?: boolean;
  target?: ScreenshotTestTargetType;
  reqBy?: string;
}

export interface UIState {
  addonState: AddonState;
  browserOptions: BrowsersOption;
  screenshotOptions: ScreenshotOptions;
  dragStart: boolean;
  selectorManager: SelectorManger;
  screenshotUpdateState: ScreenshotUpdateOptions;
  editScreenshotState: EditScreenshotState | undefined;
  schemaLoaded: boolean;
}

export const initialUIState: UIState = {
  addonState: {
    clippingWarningDismissed: false,
  } as AddonState,
  browserOptions: { all: {} },
  dragStart: false,
  editScreenshotState: undefined,
  schemaLoaded: false,
  screenshotOptions: {} as ScreenshotOptions,
  screenshotUpdateState: {},
  selectorManager: {} as SelectorManger,
};

export const useUIStore = create<UIState>()(
  persist(() => ({ ...initialUIState }), {
    name: '__playwright_ui-store',
    partialize: (state) => ({
      addonState: state.addonState,
      browserOptions: state.browserOptions,
      screenshotOptions: state.screenshotOptions,
    }),
  }),
);
