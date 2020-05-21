import { BrowserTypes } from './screenshot';

export type ActiveBrowser = {
  [key in BrowserTypes]?: boolean;
};

export type ScreenShotViewPanel = 'main' | 'dialog';

export type DisabledBrowserView = {
  [key in ScreenShotViewPanel]?: ActiveBrowser;
};

export interface AddonState {
  placement: 'auto' | 'bottom' | 'right' | string;
  previewPanelSize: number;
  disabledBrowser: DisabledBrowserView;
  previewPanelEnabled: boolean;
}
