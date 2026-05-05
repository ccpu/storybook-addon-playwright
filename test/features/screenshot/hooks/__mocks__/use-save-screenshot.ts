import type {
  BrowserContextOptions,
  BrowserTypes,
} from '../../../../../src/typings';

type SaveScreenshotResult = {
  clearError: () => void;
  error: string | undefined;
  getUpdatingScreenshotTitle: () => string | undefined;
  inProgress: boolean;
  isUpdating: (browserType: BrowserTypes) => boolean;
  onSuccessClose: () => void;
  result:
    | {
        added?: boolean;
        diffSize?: number;
        error?: unknown;
        oldScreenShotTitle?: string;
        pass?: boolean;
      }
    | undefined;
  saveScreenShot: (
    browserType: BrowserTypes,
    title: string,
    base64String?: string,
    deviceDescriptor?: BrowserContextOptions,
  ) => Promise<unknown>;
};

export const useSaveScreenshot = vi
  .fn<() => SaveScreenshotResult>()
  .mockImplementation(() => ({
    clearError: vi.fn(),
    error: undefined,
    getUpdatingScreenshotTitle: vi.fn(),
    inProgress: false,
    isUpdating: vi.fn(),
    onSuccessClose: vi.fn(),
    result: undefined,
    saveScreenShot: vi.fn(),
  }));
