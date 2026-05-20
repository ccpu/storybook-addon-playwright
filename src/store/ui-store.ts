import type {
  AddonState,
  BrowserContextOptions,
  ScreenshotData,
  ScreenshotOptions,
  ScreenshotTestTargetType,
} from '../typings';
import type { SelectorState } from '../typings/selector';
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

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
  selectorAttributeNames?: string[];
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
    previewPanelEnabled: true,
  } as AddonState,
  browserOptions: { all: {} },
  dragStart: false,
  editScreenshotState: undefined,
  schemaLoaded: false,
  screenshotOptions: {},
  screenshotUpdateState: {},
  selectorManager: {} as SelectorManger,
};

export const useUIStore = create<UIState>()(
  devtools(
    persist(() => ({ ...initialUIState }), {
      name: '__playwright_ui-store',
      partialize: (state) => ({
        addonState: state.addonState,
        browserOptions: state.browserOptions,
        screenshotOptions: state.screenshotOptions,
      }),
    }),
    { name: 'ui-store' },
  ),
);
