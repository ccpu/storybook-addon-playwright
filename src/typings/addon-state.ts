import type { BrowserTypes } from './screenshot';

export type ActiveBrowser = {
  [key in BrowserTypes]?: boolean;
};

export type ScreenShotViewPanel = 'main' | 'dialog';

export type DisabledBrowserView = {
  [key in ScreenShotViewPanel]?: ActiveBrowser;
};

export type DisplayPlacement = 'auto' | 'bottom' | 'right';

export interface AddonState {
  placement: DisplayPlacement;
  previewPanelSize: number;
  disabledBrowser: DisabledBrowserView;
  previewPanelEnabled: boolean;
  clippingWarningDismissed?: boolean;
}
