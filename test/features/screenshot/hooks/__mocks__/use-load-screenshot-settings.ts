import type { BrowsersOption } from '../../../../../src/hooks/use-browser-options';
import type { ScreenshotData, ScreenshotOptions } from '../../../../../src/typings';

interface LoadScreenshotSettingsResult {
  browserOptions: BrowsersOption;
  loadSetting: (screenshotData: ScreenshotData, force?: boolean) => void;
  screenshotOptions: ScreenshotOptions;
}

const useLoadScreenshotSettings = vi.fn<() => LoadScreenshotSettingsResult>();

useLoadScreenshotSettings.mockImplementation(() => ({
  browserOptions: { all: {} },
  loadSetting: vi.fn(),
  screenshotOptions: undefined,
}));

export { useLoadScreenshotSettings };
