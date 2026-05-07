import type { AddonState, ScreenshotOptions } from '../typings';
import type {
  BrowsersOption,
  EditScreenshotState,
  ScreenshotUpdateOptions,
  SelectorManger,
  UIState,
} from './ui-store';
import { useUIStore } from './ui-store';

function setState(partial: Partial<UIState> | ((state: UIState) => Partial<UIState>)) {
  return useUIStore.setState(partial);
}

export function setAddonState(addonState: AddonState) {
  setState({ addonState });
}

export function setBrowserOptions(browserOptions: BrowsersOption) {
  setState({ browserOptions });
}

export function setScreenshotOptionsState(screenshotOptions: ScreenshotOptions) {
  setState({ screenshotOptions });
}

export function setDragStart(dragStart: boolean) {
  setState({ dragStart });
}

export function setSelectorManager(selectorManager: SelectorManger) {
  setState({ selectorManager });
}

export function setScreenshotUpdateState(screenshotUpdateState: ScreenshotUpdateOptions) {
  setState({ screenshotUpdateState });
}

export function setEditScreenshotState(
  editScreenshotState: EditScreenshotState | undefined,
) {
  setState({ editScreenshotState });
}

export function setSchemaLoaded(schemaLoaded: boolean) {
  setState({ schemaLoaded });
}
