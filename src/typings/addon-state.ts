import { BrowserTypes } from './snapshot-info';

export type ActiveBrowser = {
  [key in BrowserTypes]?: boolean;
};

export type BrowserView = 'main' | 'preview';

export type DisabledBrowserView = { [key in BrowserView]?: ActiveBrowser };

export interface AddonState {
  placement: 'auto' | 'bottom' | 'right' | string;
  previewPanelSize: number;
  disabledBrowser: DisabledBrowserView;
}
