import { useBrowserOptions as orgUseBrowserOptions } from '../../../src/hooks/use-browser-options';

export const useBrowserOptions = vi.fn<typeof orgUseBrowserOptions>().mockImplementation(
  () =>
    ({
      browserOptions: { all: {} },
      getBrowserOptions: vi.fn(),
      hasOption: false,
      setBrowserDeviceOptions: vi.fn(),
      setBrowserOptions: vi.fn(),
    }) as ReturnType<typeof orgUseBrowserOptions>,
);
